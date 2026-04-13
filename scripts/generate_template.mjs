/**
 * Generates proexo-farms-template.xlsx
 *
 * Layout (no company header row):
 *   Row 0: Main column headers (merged groups)
 *   Row 1: Sub-headers for merged groups
 *   Row 2+: Data rows  ← readers start here (i >= 2)
 *
 * Column indices (0-based):
 *   0  A  Dirección (0x)      ← eth address used directly as farmerAddress
 *   1  B  Código
 *   2  C  Nombres
 *   3  D  Apellidos
 *   4  E  Identidad
 *   5  F  Edad
 *   6  G  [Coordenadas] Latitud
 *   7  H  [Coordenadas] Longitud
 *   8  I  [Ubicación] Departamento
 *   9  J  [Ubicación] Municipio
 *  10  K  [Ubicación] Comunidad
 *  11  L  Superficie (Ha.)
 *  12  M  Nombre Finca
 *  13  N  Altura (msnm)
 *  14  O  Variedad
 *  15  P  [Certif.] Comercio Justo
 *  16  Q  [Certif.] Orgánico
 *  17  R  [Certif.] Rainforest Alliance
 *  18  S  [Certif.] Con Manos de Mujer
 *  19  T  [Certif.] ROC
 *
 * Run: node scripts/generate_template.mjs
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

// Row 0: main headers
const row0 = [
  'Dirección (0x)',            // A  col 0
  'Código',                    // B  col 1
  'Nombres',                   // C  col 2
  'Apellidos',                 // D  col 3
  'Identidad',                 // E  col 4
  'Edad',                      // F  col 5
  'Coordenadas Geográficas', '',  // G-H merged
  'Ubicación de la Finca', '', '',// I-K merged
  'Superficie (Ha.)',          // L  col 11
  'Nombre Finca',              // M  col 12
  'Altura (msnm)',             // N  col 13
  'Variedad',                  // O  col 14
  'Certificaciones', '', '', '', '',// P-T merged
];

// Row 1: sub-headers
const row1 = [
  '', '', '', '', '', '',          // A-F no sub
  'Latitud', 'Longitud',           // G-H
  'Departamento', 'Municipio', 'Comunidad', // I-K
  '',                               // L
  '', '', '',                       // M-O no sub
  'Comercio Justo', 'Orgánico', 'Rainforest Alliance', 'Con Manos de Mujer', 'ROC',
];

// Example data row
const rowExample = [
  '0x1234567890abcdef1234567890abcdef12345678', // A Dirección (0x)
  'PXO-86',           // B Código
  'Zoila Esperanza',  // C Nombres
  'Torres Melgar',    // D Apellidos
  '0420-1965-00067',  // E Identidad
  59,                 // F Edad
  14.582771,          // G Latitud
  -88.82674,          // H Longitud
  'Copan',            // I Departamento
  'Corquín',          // J Municipio
  'Los Cedros',       // K Comunidad
  3.5,                // L Superficie
  'El Cedro',         // M Nombre Finca
  1400,               // N Altura
  'Catuaí',           // O Variedad
  'X', '', '', '', '', // P-T certifications
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([row0, row1, rowExample]);

// Merged cells
ws['!merges'] = [
  { s: { r: 0, c: 6  }, e: { r: 0, c: 7  } }, // Coordenadas G-H
  { s: { r: 0, c: 8  }, e: { r: 0, c: 10 } }, // Ubicación I-K
  { s: { r: 0, c: 15 }, e: { r: 0, c: 19 } }, // Certificaciones P-T
  // Cols with no sub-header: span both header rows
  { s: { r: 0, c: 0  }, e: { r: 1, c: 0  } }, // Dirección
  { s: { r: 0, c: 1  }, e: { r: 1, c: 1  } }, // Código
  { s: { r: 0, c: 2  }, e: { r: 1, c: 2  } }, // Nombres
  { s: { r: 0, c: 3  }, e: { r: 1, c: 3  } }, // Apellidos
  { s: { r: 0, c: 4  }, e: { r: 1, c: 4  } }, // Identidad
  { s: { r: 0, c: 5  }, e: { r: 1, c: 5  } }, // Edad
  { s: { r: 0, c: 11 }, e: { r: 1, c: 11 } }, // Superficie
  { s: { r: 0, c: 12 }, e: { r: 1, c: 12 } }, // Nombre Finca
  { s: { r: 0, c: 13 }, e: { r: 1, c: 13 } }, // Altura
  { s: { r: 0, c: 14 }, e: { r: 1, c: 14 } }, // Variedad
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
XLSX.writeFile(wb, 'proexo-farms-template.xlsx');
console.log('Generated: proexo-farms-template.xlsx');
