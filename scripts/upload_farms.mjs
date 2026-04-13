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
    if i < 2:
        continue   # skip main headers (row 0) and sub-headers (row 1)
    if not row or not row[0] or not row[12]:
        continue   # need Dirección (col 0) and Nombre Finca (col 12)
    def isX(col): return len(row) > col and str(row[col] or '').strip().upper() == 'X'
    farms.append({
        'address':       str(row[0]  or '').strip(),   # A Dirección (0x)
        'cooperativeId': str(row[1]  or '').strip(),   # B Código
        'name':          str(row[12] or '').strip(),   # M Nombre Finca
        'height':        str(row[13] or '').strip(),   # N Altura (msnm)
        'area':          str(row[11] or '').strip(),   # L Superficie (Ha.)
        'latitude':      str(row[6]  or '').strip(),   # G Latitud
        'longitude':     str(row[7]  or '').strip(),   # H Longitud
        'region':        str(row[8]  or '').strip(),   # I Departamento
        'village2':      str(row[9]  or '').strip(),   # J Municipio
        'village':       str(row[10] or '').strip(),   # K Comunidad
        'varieties':     str(row[14] or '').strip(),   # O Variedad
        'bio': '',
        'certifications': ', '.join(filter(None, [
            'Fairtrade'           if isX(15) else '',
            'Orgánico'            if isX(16) else '',
            'Rainforest Alliance' if isX(17) else '',
            'Con Manos de Mujer'  if isX(18) else '',
            'ROC'                 if isX(19) else '',
        ])),
    })

print(json.dumps(farms, ensure_ascii=False))
"`, { cwd: process.cwd() }).toString();

const excelFarms = JSON.parse(raw);

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

let updated = 0;
let notFound = 0;

for (const farm of excelFarms) {
  // Use address from the Excel file directly (col 0); fall back to lookup by cooperativeId
  const ethAddress = farm.address || coopToFarmer[farm.cooperativeId.toUpperCase()]?.address;
  if (!ethAddress) {
    console.warn(`  No address found for cooperativeId: ${farm.cooperativeId}`);
    notFound++;
    continue;
  }

  // Find existing farm document by eth address
  const farmsSnap = await getDocs(
    query(collection(db, 'farms'), where('farmerAddress', '==', ethAddress))
  );

  const payload = {
    farmerAddress: ethAddress,
    company: 'PROEXO',
    name: farm.name,
    varieties: farm.varieties,
    certifications: farm.certifications,
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
      if (existing.data().farmerAddress === ethAddress) break; // same farmer
      docId = `${baseId}#${suffix}`;
      suffix++;
    }
    await setDoc(doc(db, 'farms', docId), { ...payload, farmerId: farm.cooperativeId });
  } else {
    // Update all existing docs (usually one)
    for (const farmDoc of farmsSnap.docs) {
      await setDoc(doc(db, 'farms', farmDoc.id), { ...payload, farmerId: farm.cooperativeId }, { merge: true });
    }
  }
  updated++;
}

process.exit(0);
