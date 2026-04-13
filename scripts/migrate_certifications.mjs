/**
 * Consolidates individual certification X-fields (fairtrade, organico, rainforest,
 * manosdemujer, roc) into a single comma-separated `certifications` string field,
 * then deletes the redundant individual fields from all farm documents.
 *
 * Run: node scripts/migrate_certifications.mjs
 * Add --dry-run to preview without writing.
 */
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs,
  doc, updateDoc, deleteField,
} from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');

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

// Canonical names matching what's stored in the Firebase certifications collection
const X_FIELD_TO_NAME = {
  fairtrade:    'Fairtrade',
  organico:     'Orgánico',
  rainforest:   'Rainforest Alliance',
  manosdemujer: 'Con Manos de Mujer',
  roc:          'ROC',
};
const X_FIELDS = Object.keys(X_FIELD_TO_NAME);

console.log(DRY_RUN ? '--- DRY RUN (no writes) ---\n' : '--- LIVE RUN ---\n');

const snap = await getDocs(collection(db, 'farms'));
console.log(`Total farms in DB: ${snap.docs.length}`);

let updated = 0;
let skipped = 0;

for (const d of snap.docs) {
  const data = d.data();

  // Collect which X fields are set
  const xCerts = X_FIELDS.filter(k => data[k] === 'X');

  // Does this doc have any X fields at all?
  const hasXFields = X_FIELDS.some(k => k in data);

  if (!hasXFields) {
    skipped++;
    continue;
  }

  // Build canonical certifications string from X fields,
  // then merge with any existing certifications string values
  const fromX = xCerts.map(k => X_FIELD_TO_NAME[k]);

  // Parse existing certifications string (may contain legacy inconsistent values)
  // We replace it entirely with the canonical values derived from X fields,
  // since X fields were set from the authoritative upload spreadsheet.
  const canonicalCerts = fromX.join(', ');

  const deleteXFields = Object.fromEntries(X_FIELDS.map(k => [k, deleteField()]));

  console.log(`${d.id.slice(0, 30).padEnd(30)} | X: [${xCerts.join(', ')}] | certifications: "${canonicalCerts}"`);

  if (!DRY_RUN) {
    await updateDoc(doc(db, 'farms', d.id), {
      certifications: canonicalCerts,
      ...deleteXFields,
    });
  }
  updated++;
}

console.log(`\nDone. Updated: ${updated}, Skipped (no X fields): ${skipped}`);
if (DRY_RUN) console.log('Re-run without --dry-run to apply changes.');

process.exit(0);
