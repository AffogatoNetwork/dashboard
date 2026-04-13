import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { writeFileSync } from 'fs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env from project root
const envPath = resolve(new URL('..', import.meta.url).pathname, '.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').replace(/^"|"$/g, '').trim()]; })
);

const app = initializeApp({
  apiKey: env.REACT_APP_FB_API_KEY,
  authDomain: env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: env.REACT_APP_FB_PROJECT_ID,
  storageBucket: env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: env.REACT_APP_FB_MSG_SENDER_ID,
  appId: env.REACT_APP_FB_APP_ID,
});

const db = getFirestore(app);
const COMPANY = 'PROEXO';

console.log(`Fetching farmers for ${COMPANY}...`);
const farmersSnap = await getDocs(
  query(collection(db, 'farmers'), where('company', '==', COMPANY))
);
const farmers = farmersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
console.log(`  → ${farmers.length} farmers found`);

console.log(`Fetching farms for ${COMPANY}...`);
const farmsSnap = await getDocs(
  query(collection(db, 'farms'), where('company', '==', COMPANY))
);
const farms = farmsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
console.log(`  → ${farms.length} farms found`);

// Derive X fields from the certifications string.
// Handles both canonical English names and legacy Spanish variants.
const CERT_MATCHERS = [
  { key: 'fairtrade',    matches: ['Fairtrade', 'Comercio Justo', 'Fair Trade'] },
  { key: 'organico',     matches: ['Orgánico', 'Organico', 'Orgánica', 'Orgánica (EU)'] },
  { key: 'rainforest',   matches: ['Rainforest Alliance', 'Rainforest', 'Rain Forest Alliance'] },
  { key: 'manosdemujer', matches: ['Con Manos de Mujer', 'Manos de Mujer'] },
  { key: 'roc',          matches: ['ROC'] },
];

function addXFields(farm) {
  const certList = (farm.certifications || '').split(',').map(s => s.trim());
  const xFields = {};
  for (const { key, matches } of CERT_MATCHERS) {
    xFields[key] = certList.some(c => matches.includes(c)) ? 'X' : '';
  }
  return { ...farm, ...xFields };
}

// Group farms by farmerAddress for easy lookup
const farmsByFarmer = {};
for (const farm of farms) {
  const key = farm.farmerAddress || 'unknown';
  if (!farmsByFarmer[key]) farmsByFarmer[key] = [];
  farmsByFarmer[key].push(addXFields(farm));
}

// Build enriched farmers list with their farms nested
const farmersWithFarms = farmers.map(farmer => ({
  ...farmer,
  farms: farmsByFarmer[farmer.address] || [],
}));

// Count farmers with no farms
const noFarms = farmersWithFarms.filter(f => f.farms.length === 0).length;
const withFarms = farmersWithFarms.filter(f => f.farms.length > 0).length;

const output = {
  company: COMPANY,
  exportedAt: new Date().toISOString(),
  summary: {
    totalFarmers: farmers.length,
    totalFarms: farms.length,
    farmersWithFarms: withFarms,
    farmersWithNoFarms: noFarms,
  },
  farmers: farmersWithFarms,
};

const filename = `proexo-export-${new Date().toISOString().slice(0, 10)}.json`;
const outPath = resolve(new URL('..', import.meta.url).pathname, filename);
writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');

console.log(`\nSummary:`);
console.log(`  Farmers: ${farmers.length}`);
console.log(`  Farms:   ${farms.length}`);
console.log(`  Farmers with farms: ${withFarms}`);
console.log(`  Farmers without farms: ${noFarms}`);
console.log(`\nExported → ${outPath}`);

process.exit(0);
