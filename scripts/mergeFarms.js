const XLSX = require('xlsx');
const path = require('path');

const targetFile = '/Users/antoniocardenas/Documents/GitHub/dashboard/proexo-farms-data.xlsx';
const sourceAFile = '/Users/antoniocardenas/Downloads/Base de Datos Productoras-PNUD-PROEXO.xlsx';
const sourceBFile = '/Users/antoniocardenas/Downloads/Base de Datos Productoras-26-PROEXO.xlsx';

function normalizeName(first, last) {
  if (!first) first = '';
  if (!last) last = '';
  const fullName = `${first} ${last}`;
  return fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, '') // Remove non-alphanumeric
    .trim();
}

function mergeData() {
  console.log('--- Starting Merge Process ---');

  // Load target
  const targetWorkbook = XLSX.readFile(targetFile);
  const targetSheet = targetWorkbook.Sheets[targetWorkbook.SheetNames[0]];
  const targetData = XLSX.utils.sheet_to_json(targetSheet, { header: 1 });
  
  // Load sources
  const sourceAData = XLSX.utils.sheet_to_json(XLSX.readFile(sourceAFile).Sheets['Hoja1'], { header: 1 });
  const sourceBData = XLSX.utils.sheet_to_json(XLSX.readFile(sourceBFile).Sheets['Hoja1'], { header: 1 });

  const lookup = {};

  // Index Source A (PNUD) - Starts at Row 4
  sourceAData.slice(4).forEach(row => {
    if (!row || row.length === 0) return;
    const item = {
      code: row[1],
      id: row[4],
      age: row[5],
      certs: {
        cj: row[12],
        org: row[13],
        rain: row[14],
        manos: row[15],
        roc: row[16]
      }
    };
    if (item.id) lookup[String(item.id)] = item;
    const nameKey = normalizeName(row[2], row[3]);
    if (nameKey) lookup[nameKey] = item;
  });

  // Index Source B (26 Producers) - Starts at Row 4
  sourceBData.slice(4).forEach(row => {
    if (!row || row.length === 0) return;
    const item = {
      code: row[1],
      id: row[4],
      age: row[5],
      height: row[8],
      variety: row[9],
      farmName: row[10],
      certs: {
        cj: row[15],
        org: row[16],
        rain: row[17],
        manos: row[18],
        roc: row[19]
      }
    };
    if (item.id) lookup[String(item.id)] = item;
    const nameKey = normalizeName(row[2], row[3]);
    if (nameKey) lookup[nameKey] = item;
  });

  let updatedCount = 0;
  
  // Update Target Data - Starts at Row 2
  for (let i = 2; i < targetData.length; i++) {
    const row = targetData[i];
    if (!row || row.length === 0) continue;

    const targetId = row[4];
    const targetNameKey = normalizeName(row[2], row[3]);
    
    // Find match
    const match = (targetId && lookup[String(targetId)]) || (targetNameKey && lookup[targetNameKey]);

    if (match) {
      let changed = false;
      
      // Update Code (Index 1)
      if (!row[1] && match.code) { row[1] = match.code; changed = true; }
      // Update ID (Index 4)
      if (!row[4] && match.id) { row[4] = match.id; changed = true; }
      // Update Age (Index 5)
      if (!row[5] && match.age) { row[5] = match.age; changed = true; }
      // Update Farm Name (Index 12)
      if (!row[12] && match.farmName) { row[12] = match.farmName; changed = true; }
      // Update Height (Index 13)
      if (!row[13] && match.height) { row[13] = match.height; changed = true; }
      // Update Variety (Index 14)
      if (!row[14] && match.variety) { row[14] = match.variety; changed = true; }
      
      // Update Certs (15-19)
      if (!row[15] && match.certs?.cj) { row[15] = match.certs.cj; changed = true; }
      if (!row[16] && match.certs?.org) { row[16] = match.certs.org; changed = true; }
      if (!row[17] && match.certs?.rain) { row[17] = match.certs.rain; changed = true; }
      if (!row[18] && match.certs?.manos) { row[18] = match.certs.manos; changed = true; }
      if (!row[19] && match.certs?.roc) { row[19] = match.certs.roc; changed = true; }

      if (changed) updatedCount++;
    }
  }

  // Create new worksheet
  const newWorksheet = XLSX.utils.aoa_to_sheet(targetData);
  targetWorkbook.Sheets[targetWorkbook.SheetNames[0]] = newWorksheet;
  
  // Save
  XLSX.writeFile(targetWorkbook, targetFile);
  
  console.log(`Successfully updated ${updatedCount} rows in proexo-farms-data.xlsx`);
}

mergeData();
