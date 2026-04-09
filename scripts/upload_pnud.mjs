import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';
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

// Parse PNUD.xlsx
const raw = execSync(`python3 -c "
import openpyxl, json

wb = openpyxl.load_workbook('public/PNUD.xlsx', read_only=True)
ws = wb.active

rows = []
for i, row in enumerate(ws.iter_rows(values_only=True)):
    if i < 4: continue
    if not row or not row[1]: continue
    def cert(val):
        return 'X' if str(val or '').strip().lower() == 'x' else ''
    fairtrade    = cert(row[12])
    organico     = cert(row[13])
    rainforest   = cert(row[14])
    manosdemujer = cert(row[15])
    roc          = cert(row[16])
    rows.append({
        'codigo':    str(row[1]).strip(),
        'fullname':  ' '.join((str(row[2] or '') + ' ' + str(row[3] or '')).split()).lower(),
        'latitude':  str(row[6] or '').strip(),
        'longitude': str(row[7] or '').strip(),
        'region':    str(row[8] or '').strip(),
        'village2':  str(row[9] or '').strip(),
        'village':   str(row[10] or '').strip(),
        'area':      str(row[11] or '').strip(),
        'fairtrade':    fairtrade,
        'organico':     organico,
        'rainforest':   rainforest,
        'manosdemujer': manosdemujer,
        'roc':          roc,
        'certifications': ', '.join(filter(None, [
            'Fairtrade'          if fairtrade    == 'X' else '',
            'Organico'           if organico     == 'X' else '',
            'Rainforest'         if rainforest   == 'X' else '',
            'Con Manos de Mujer' if manosdemujer == 'X' else '',
            'ROC'                if roc          == 'X' else '',
        ])),
    })
print(json.dumps(rows, ensure_ascii=False))
"`, { cwd: process.cwd() }).toString();

const pnudRows = JSON.parse(raw);

// Load all PROEXO farmers — build lookup by farmerId and fullname
const farmersSnap = await getDocs(query(collection(db, 'farmers'), where('company', '==', 'PROEXO')));
const farmerIdToDoc = {};   // farmerId (upper) → { address, docId }
const nameToDoc = {};       // fullname (lower) → { address, docId }

farmersSnap.forEach(d => {
  const data = d.data();
  if (!data.address) return;
  if (data.farmerId) farmerIdToDoc[data.farmerId.toUpperCase()] = { address: data.address, docId: d.id };
  if (data.fullname) nameToDoc[data.fullname.toLowerCase().split(/\s+/).join(' ')] = { address: data.address, docId: d.id };
});

const notFoundList = [];
let updated = 0;

for (const row of pnudRows) {
  // Match: 1) Código as farmerId  2) fullname
  const match = farmerIdToDoc[row.codigo.toUpperCase()] || nameToDoc[row.fullname];

  if (!match) {
    notFoundList.push(`  - ${row.codigo} | "${row.fullname}"`);
    continue;
  }

  // Update farmer doc: set farmerId = Código, cooperativeId = 'PROEXO'
  await updateDoc(doc(db, 'farmers', match.docId), {
    farmerId: row.codigo,
    cooperativeId: 'PROEXO',
  });

  // Update farm doc(s)
  const farmsSnap = await getDocs(
    query(collection(db, 'farms'), where('farmerAddress', '==', match.address))
  );

  const farmPayload = {
    pnud: true,
    fairtrade: row.fairtrade,
    organico: row.organico,
    rainforest: row.rainforest,
    manosdemujer: row.manosdemujer,
    roc: row.roc,
    certifications: row.certifications,
    latitude: row.latitude,
    longitude: row.longitude,
    region: row.region,
    village2: row.village2,
    village: row.village,
    area: row.area,
  };

  if (farmsSnap.empty) {
    const docId = `${match.address}pnud`;
    await setDoc(doc(db, 'farms', docId), {
      ...farmPayload,
      farmerAddress: match.address,
      company: 'PROEXO',
      name: '', height: '', bio: '', shadow: '',
      familyMembers: '', ethnicGroup: '', varieties: '',
      country: '', location: '', search: '',
    });
  } else {
    for (const farmDoc of farmsSnap.docs) {
      await setDoc(doc(db, 'farms', farmDoc.id), farmPayload, { merge: true });
    }
  }
  updated++;
}

if (notFoundList.length > 0) {
}
process.exit(0);
