import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, query, where } from 'firebase/firestore';
import { execSync } from 'child_process';
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

// Parse Excel with Python
const raw = execSync(`python3 -c "
import openpyxl, json

wb = openpyxl.load_workbook('public/Base de Datos Productoras-26-PROEXO.xlsx', read_only=True)
ws = wb.active

farms = []
for i, row in enumerate(ws.iter_rows(values_only=True)):
    if i < 3:
        continue
    if not row or not row[1] or not row[2]:
        continue
    fairtrade    = 'X' if str(row[15] or '').strip().upper() == 'X' else ''
    organico     = 'X' if str(row[16] or '').strip().upper() == 'X' else ''
    rainforest   = 'X' if str(row[17] or '').strip().upper() == 'X' else ''
    manosdemujer = 'X' if str(row[18] or '').strip().upper() == 'X' else ''
    roc          = 'X' if str(row[19] or '').strip().upper() == 'X' else ''
    farms.append({
        'cooperativeId': str(row[1] or '').strip(),
        'name': str(row[2] or '').strip(),
        'height': str(row[8] or '').strip(),
        'area': str(row[14] or '').strip(),
        'fairtrade': fairtrade,
        'organico': organico,
        'rainforest': rainforest,
        'manosdemujer': manosdemujer,
        'roc': roc,
        'certifications': ', '.join(filter(None, [
            'Fairtrade'          if fairtrade    == 'X' else '',
            'Organico'           if organico     == 'X' else '',
            'Rainforest'         if rainforest   == 'X' else '',
            'Con Manos de Mujer' if manosdemujer == 'X' else '',
            'ROC'                if roc          == 'X' else '',
        ])),
        'latitude': str(row[6] or '').strip(),
        'longitude': str(row[7] or '').strip(),
        'bio': str(row[10] or '').strip(),
        'region': str(row[11] or '').strip(),
        'village': str(row[13] or '').strip(),
        'village2': str(row[12] or '').strip(),
        'varieties': str(row[9] or '').strip(),
    })

print(json.dumps(farms, ensure_ascii=False))
"`, { cwd: process.cwd() }).toString();

const excelFarms = JSON.parse(raw);
console.log(`Parsed ${excelFarms.length} farms from Excel`);

// Build a map of cooperativeId → eth address + farm doc id
// by querying farmers collection
const farmersSnap = await getDocs(query(collection(db, 'farmers'), where('company', '==', 'PROEXO')));
const coopToFarmer = {};
farmersSnap.forEach(d => {
  const data = d.data();
  if (data.cooperativeId) {
    coopToFarmer[data.cooperativeId.toUpperCase()] = { address: data.address, fullname: data.fullname };
  }
});
console.log(`Loaded ${Object.keys(coopToFarmer).length} farmers from Firestore`);

let updated = 0;
let notFound = 0;

for (const farm of excelFarms) {
  const farmer = coopToFarmer[farm.cooperativeId.toUpperCase()];
  if (!farmer) {
    console.warn(`  No farmer found for cooperativeId: ${farm.cooperativeId}`);
    notFound++;
    continue;
  }

  // Find existing farm document by eth address
  const farmsSnap = await getDocs(
    query(collection(db, 'farms'), where('farmerAddress', '==', farmer.address))
  );

  const payload = {
    farmerAddress: farmer.address,       // always eth address going forward
    company: 'PROEXO',
    name: farm.name,
    varieties: farm.varieties,
    certifications: farm.certifications,
    fairtrade: farm.fairtrade,
    organico: farm.organico,
    rainforest: farm.rainforest,
    manosdemujer: farm.manosdemujer,
    roc: farm.roc,
    height: farm.height,
    area: farm.area,
    latitude: farm.latitude,
    longitude: farm.longitude,
    bio: farm.bio,
    region: farm.region,
    village: farm.village,
    village2: farm.village2,
    country: '',
    shadow: '',
    familyMembers: '',
    ethnicGroup: '',
    location: '',
    search: '',
  };

  if (farmsSnap.empty) {
    // No existing doc — create one using PXO código as doc ID
    // If that slot is taken by a different farmer, try PXO-xxx#1, #2 ...
    const baseId = farm.cooperativeId.trim();
    let docId = baseId;
    let suffix = 1;
    while (true) {
      const existing = await getDoc(doc(db, 'farms', docId));
      if (!existing.exists()) break;
      if (existing.data().farmerAddress === farmer.address) break; // same farmer
      docId = `${baseId}#${suffix}`;
      suffix++;
    }
    await setDoc(doc(db, 'farms', docId), { ...payload, farmerId: farm.cooperativeId });
    console.log(`  Created ${docId} → varieties: ${farm.varieties} | certs: ${farm.certifications}`);
  } else {
    // Update all existing docs (usually one)
    for (const farmDoc of farmsSnap.docs) {
      await setDoc(doc(db, 'farms', farmDoc.id), { ...payload, farmerId: farm.cooperativeId }, { merge: true });
      console.log(`  Updated ${farmDoc.id} → varieties: ${farm.varieties} | certs: ${farm.certifications}`);
    }
  }
  updated++;
}

console.log(`\nDone — updated: ${updated}, not found: ${notFound}`);
process.exit(0);
