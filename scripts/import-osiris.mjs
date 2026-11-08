import fs from 'node:fs';

function extractObjectText(filePath, startMarker) {
  const content = fs.readFileSync(filePath, 'utf8');
  const idx = content.indexOf(startMarker);
  if (idx === -1) return null;
  const startIdx = content.indexOf('[', idx);
  if (startIdx === -1) return null;

  let bracketCount = 0;
  let inString = null;
  let isEscape = false;
  let endIdx = -1;

  for (let i = startIdx; i < content.length; i++) {
    const ch = content[i];
    if (inString) {
      if (isEscape) {
        isEscape = false;
      } else if (ch === '\\') {
        isEscape = true;
      } else if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
      continue;
    }

    if (ch === '[') {
      bracketCount++;
    } else if (ch === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  if (endIdx === -1) return null;
  return content.slice(startIdx, endIdx);
}

// Clean TS syntax like 'as const'
function cleanTs(str) {
  return str.replace(/\bas\s+const\b/g, '');
}

// 1. Nuclear
const nucText = extractObjectText('/Users/yaswanth/Downloads/osiris-5.0.0/src/app/api/infrastructure/route.ts', 'NUCLEAR_FACILITIES');
if (nucText) {
  const fn = new Function('return ' + cleanTs(nucText));
  const nucArray = fn();
  console.log('Extracted nuclear facilities:', nucArray.length);
  fs.writeFileSync('src/data/nuclearInstallationsData.js', `/**
 * @module nuclearInstallationsData
 * @description Global Nuclear Power Plants & Facilities (imported from OSIRIS d9c47752-5733-461e-bb5d-5d84594c38ce).
 */

export const NUCLEAR_FACILITIES = ${JSON.stringify(nucArray, null, 2)};
`);
  console.log('Saved src/data/nuclearInstallationsData.js');
}

// 2. Conflicts
const conflictText = extractObjectText('/Users/yaswanth/Downloads/osiris-5.0.0/src/app/api/conflicts/route.ts', 'KNOWN_CONFLICTS');
if (conflictText) {
  const fn = new Function('return ' + cleanTs(conflictText));
  const conflictArray = fn();
  console.log('Extracted conflict zones:', conflictArray.length);
  fs.writeFileSync('src/data/conflictZonesData.js', `/**
 * @module conflictZonesData
 * @description Global Active Conflict Zones & Frontlines (imported from OSIRIS d9c47752-5733-461e-bb5d-5d84594c38ce).
 */

export const CONFLICT_ZONES = ${JSON.stringify(conflictArray, null, 2)};
`);
  console.log('Saved src/data/conflictZonesData.js');
}
