/**
 * Generates proexo-farms-data.xlsx from proexo-export-*.json
 *
 * Includes ALL 296 PROEXO farmers:
 *  - Farmers with farms → one row per farm
 *  - Farmers without farms → one row with farmer data, empty farm columns
 *
 * Column layout matches the upload template exactly.
 *
 * Run: node scripts/export_to_excel.mjs
 */

import { createRequire } from 'module';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const root = new URL('..', import.meta.url).pathname;

// Find the most recent export JSON
const jsonFile = readdirSync(root)
  .filter(f => f.startsWith('proexo-export-') && f.endsWith('.json'))
  .sort()
  .at(-1);

if (!jsonFile) {
  console.error('No proexo-export-*.json found. Run export_proexo.mjs first.');
  process.exit(1);
}

console.log(`Reading: ${jsonFile}`);
const data = JSON.parse(readFileSync(resolve(root, jsonFile), 'utf8'));

// ── Helpers ──────────────────────────────────────────────────────────────────

// Honduras national ID pattern: DDDD-YYYY-NNNNN
const isNatId = s => /^\d{4}-\d{4}-\d{5}$/.test((s || '').trim());

function splitName(fullname) {
  const parts = (fullname || '').trim().split(/\s+/);
  // First two tokens → Nombres, rest → Apellidos
  const nombres   = parts.slice(0, 2).join(' ');
  const apellidos = parts.slice(2).join(' ');
  return { nombres, apellidos };
}

// ── Header rows ───────────────────────────────────────────────────────────────
const row0 = [
  'Dirección (0x)', 'Código', 'Nombres', 'Apellidos', 'Identidad', 'Edad',
  'Coordenadas Geográficas', '',
  'Ubicación de la Finca', '', '',
  'Superficie (Ha.)',
  'Nombre Finca', 'Altura (msnm)', 'Variedad',
  'Certificaciones', '', '', '', '',
];

const row1 = [
  '', '', '', '', '', '',
  'Latitud', 'Longitud',
  'Departamento', 'Municipio', 'Comunidad',
  '',
  '', '', '',
  'Comercio Justo', 'Orgánico', 'Rainforest Alliance', 'Con Manos de Mujer', 'ROC',
];

// ── Build data rows ───────────────────────────────────────────────────────────
const dataRows = [];
let withFarms = 0;
let noFarms = 0;

for (const farmer of data.farmers) {
  const { nombres, apellidos } = splitName(farmer.fullname);

  // PXO code: prefer farmerId if it starts with PXO, otherwise leave blank
  const pxoCodigo = (farmer.farmerId || '').startsWith('PXO')
    ? farmer.farmerId
    : '';

  // Identidad: cooperativeId if it matches national ID pattern
  const identidad = isNatId(farmer.cooperativeId) ? farmer.cooperativeId : '';

  const farmerBase = [
    farmer.address    || '',  // A  Dirección (0x)
    pxoCodigo,                // B  Código PXO
    nombres,                  // C  Nombres
    apellidos,                // D  Apellidos
    identidad,                // E  Identidad
    '',                       // F  Edad (not stored)
  ];

  if (!farmer.farms || farmer.farms.length === 0) {
    // Farmer with no farms → one row, farm columns empty
    dataRows.push([
      ...farmerBase,
      farmer.latitude  || '',  // G  Latitud (from farmer doc)
      farmer.longitude || '',  // H  Longitud (from farmer doc)
      farmer.region    || '',  // I  Departamento
      farmer.village2  || '',  // J  Municipio
      farmer.village   || '',  // K  Comunidad
      farmer.area      || '',  // L  Superficie
      '',                      // M  Nombre Finca
      farmer.height    || '',  // N  Altura
      farmer.varieties || '',  // O  Variedad
      '', '', '', '', '',      // P-T Certifications
    ]);
    noFarms++;
    continue;
  }

  for (const farm of farmer.farms) {
    dataRows.push([
      ...farmerBase,
      farm.latitude    || farmer.latitude  || '',  // G  Latitud
      farm.longitude   || farmer.longitude || '',  // H  Longitud
      farm.region      || farmer.region    || '',  // I  Departamento
      farm.village2    || '',                      // J  Municipio
      farm.village     || farmer.village   || '',  // K  Comunidad
      farm.area        || farmer.area      || '',  // L  Superficie
      farm.name        || '',                      // M  Nombre Finca
      farm.height      || farmer.height    || '',  // N  Altura
      farm.varieties   || farmer.varieties || '',  // O  Variedad
      farm.fairtrade    || '',                     // P  Comercio Justo
      farm.organico     || '',                     // Q  Orgánico
      farm.rainforest   || '',                     // R  Rainforest Alliance
      farm.manosdemujer || '',                     // S  Con Manos de Mujer
      farm.roc          || '',                     // T  ROC
    ]);
  }
  withFarms++;
}

console.log(`Farmers with farms:    ${withFarms}`);
console.log(`Farmers without farms: ${noFarms}`);
console.log(`Total rows:            ${dataRows.length}`);

// ── Build workbook ────────────────────────────────────────────────────────────
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([row0, row1, ...dataRows]);

ws['!merges'] = [
  { s: { r: 0, c: 6  }, e: { r: 0, c: 7  } },
  { s: { r: 0, c: 8  }, e: { r: 0, c: 10 } },
  { s: { r: 0, c: 15 }, e: { r: 0, c: 19 } },
  { s: { r: 0, c: 0  }, e: { r: 1, c: 0  } },
  { s: { r: 0, c: 1  }, e: { r: 1, c: 1  } },
  { s: { r: 0, c: 2  }, e: { r: 1, c: 2  } },
  { s: { r: 0, c: 3  }, e: { r: 1, c: 3  } },
  { s: { r: 0, c: 4  }, e: { r: 1, c: 4  } },
  { s: { r: 0, c: 5  }, e: { r: 1, c: 5  } },
  { s: { r: 0, c: 11 }, e: { r: 1, c: 11 } },
  { s: { r: 0, c: 12 }, e: { r: 1, c: 12 } },
  { s: { r: 0, c: 13 }, e: { r: 1, c: 13 } },
  { s: { r: 0, c: 14 }, e: { r: 1, c: 14 } },
];

ws['!cols'] = [
  { wch: 44 }, // A Dirección (0x)
  { wch: 12 }, // B Código
  { wch: 20 }, // C Nombres
  { wch: 20 }, // D Apellidos
  { wch: 18 }, // E Identidad
  { wch: 6  }, // F Edad
  { wch: 14 }, // G Latitud
  { wch: 14 }, // H Longitud
  { wch: 16 }, // I Departamento
  { wch: 16 }, // J Municipio
  { wch: 18 }, // K Comunidad
  { wch: 14 }, // L Superficie
  { wch: 22 }, // M Nombre Finca
  { wch: 14 }, // N Altura
  { wch: 18 }, // O Variedad
  { wch: 16 }, // P Comercio Justo
  { wch: 12 }, // Q Orgánico
  { wch: 22 }, // R Rainforest Alliance
  { wch: 22 }, // S Con Manos de Mujer
  { wch: 8  }, // T ROC
];

XLSX.utils.book_append_sheet(wb, ws, 'Productoras');

const outFile = resolve(root, 'proexo-farms-data.xlsx');
XLSX.writeFile(wb, outFile);
console.log(`\nDone → proexo-farms-data.xlsx`);
