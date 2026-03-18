import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
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

const isPxoCode = (val) => /^PXO-\d+$/i.test(String(val || '').trim());

const snap = await getDocs(
  query(collection(db, 'farmers'), where('company', '==', 'PROEXO'))
);

let cleared = 0;
let skipped = 0;

for (const d_ of snap.docs) {
  const data = d_.data();
  const farmerId = data.farmerId;

  if (!farmerId) { skipped++; continue; }         // already blank
  if (isPxoCode(farmerId)) { skipped++; continue; } // PXO-xxx — keep it

  // Non-PXO value (national ID, raw number, etc.) — clear it
  console.log(`  Clearing farmerId "${farmerId}" on ${data.fullname} (${data.address})`);
  await updateDoc(doc(db, 'farmers', d_.id), { farmerId: '' });
  cleared++;
}

console.log(`\nDone — cleared: ${cleared}, skipped (already ok): ${skipped}`);
process.exit(0);
