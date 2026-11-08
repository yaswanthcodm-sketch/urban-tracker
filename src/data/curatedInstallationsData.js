/**
 * Curated Defense & Naval Installations Fallback Data.
 *
 * Provides a reliable fallback dataset of key defense facilities, naval bases,
 * air bases, and command stations in OSM element schema.
 * Used when upstream public Overpass API is rate-limited, times out, or is offline.
 */

import { NUCLEAR_FACILITIES } from './nuclearInstallationsData.js';
import { CONFLICT_ZONES } from './conflictZonesData.js';
import { GLOBAL_PORTS } from './globalPortsData.js';

export const CURATED_MILITARY_INSTALLATIONS = [
  // -------------------------------------------------------------------------
  // INDIA — NAVAL & DEFENSE FACILITIES
  // -------------------------------------------------------------------------
  {
    type: 'node',
    id: 91001001,
    lat: 18.9265,
    lon: 72.8420,
    tags: {
      name: 'INS Angre — Western Naval Command HQ (Mumbai)',
      military: 'naval_base',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001002,
    lat: 18.8950,
    lon: 72.8250,
    tags: {
      name: 'INS Trata — Coastal Missile Defense Base (Mumbai)',
      military: 'base',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001003,
    lat: 18.7510,
    lon: 73.4150,
    tags: {
      name: 'INS Shivaji — Naval Engineering Academy (Lonavala)',
      military: 'base',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001004,
    lat: 14.8150,
    lon: 74.1450,
    tags: {
      name: 'INS Kadamba — Project Seabird Mega Naval Base (Karwar)',
      military: 'naval_base',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001005,
    lat: 15.3800,
    lon: 73.8320,
    tags: {
      name: 'INS Hansa — Naval Air Station (Goa)',
      military: 'airfield',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001006,
    lat: 9.9500,
    lon: 76.2750,
    tags: {
      name: 'INS Venduruthy — Southern Naval Command (Kochi)',
      military: 'naval_base',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001007,
    lat: 9.9450,
    lon: 76.2850,
    tags: {
      name: 'INS Garuda — Naval Air Station (Kochi)',
      military: 'airfield',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001008,
    lat: 17.6950,
    lon: 83.2850,
    tags: {
      name: 'INS Circars — Eastern Naval Command HQ (Visakhapatnam)',
      military: 'naval_base',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001009,
    lat: 17.7210,
    lon: 83.2250,
    tags: {
      name: 'INS Dega — Naval Air Station (Visakhapatnam)',
      military: 'airfield',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001010,
    lat: 17.5200,
    lon: 83.0500,
    tags: {
      name: 'INS Varsha — Strategic Submarine Base (Rambilli)',
      military: 'naval_base',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001011,
    lat: 13.0800,
    lon: 80.2950,
    tags: {
      name: 'INS Adyar — Naval Coastal Base (Chennai)',
      military: 'naval_base',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001012,
    lat: 12.9800,
    lon: 79.8050,
    tags: {
      name: 'INS Rajali — Long Range Maritime Recon Air Station (Arakkonam)',
      military: 'airfield',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001013,
    lat: 11.6600,
    lon: 92.7300,
    tags: {
      name: 'INS Jarawa — Andaman & Nicobar Tri-Services Command (Port Blair)',
      military: 'naval_base',
      operator: 'Indian Armed Forces',
    },
  },
  {
    type: 'node',
    id: 91001014,
    lat: 11.6420,
    lon: 92.7300,
    tags: {
      name: 'INS Utkrosh — Naval Air Station (Port Blair)',
      military: 'airfield',
      operator: 'Indian Navy',
    },
  },
  {
    type: 'node',
    id: 91001015,
    lat: 6.9950,
    lon: 93.9250,
    tags: {
      name: 'INS Baaz — Southernmost Maritime Air Station (Campbell Bay)',
      military: 'airfield',
      operator: 'Indian Navy',
    },
  },

  // -------------------------------------------------------------------------
  // INDIA — AIR FORCE STATIONS (AFS) & BASES
  // -------------------------------------------------------------------------
  {
    type: 'node',
    id: 91002001,
    lat: 30.3700,
    lon: 76.8200,
    tags: {
      name: 'Ambala Air Force Station — Rafale Base (Haryana)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },
  {
    type: 'node',
    id: 91002002,
    lat: 28.7050,
    lon: 77.3600,
    tags: {
      name: 'Hindon Air Force Station — Strategic Airlift Base (Ghaziabad)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },
  {
    type: 'node',
    id: 91002003,
    lat: 18.5820,
    lon: 73.9200,
    tags: {
      name: 'Pune Air Force Station — Su-30MKI Squadron Base (Lohegaon)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },
  {
    type: 'node',
    id: 91002004,
    lat: 13.1350,
    lon: 77.6050,
    tags: {
      name: 'Yelahanka Air Force Station — Training & Transport (Bengaluru)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },
  {
    type: 'node',
    id: 91002005,
    lat: 17.4550,
    lon: 78.4750,
    tags: {
      name: 'Hakimpet Air Force Station — Fighter Training Wing (Secunderabad)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },
  {
    type: 'node',
    id: 91002006,
    lat: 17.0250,
    lon: 78.5850,
    tags: {
      name: 'Dundigal Air Force Academy (AFA) (Telangana)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },
  {
    type: 'node',
    id: 91002007,
    lat: 28.4200,
    lon: 79.4500,
    tags: {
      name: 'Bareilly Air Force Station — Su-30MKI Air Base (Uttar Pradesh)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },
  {
    type: 'node',
    id: 91002008,
    lat: 26.2500,
    lon: 73.0500,
    tags: {
      name: 'Jodhpur Air Force Station — Western Air Command (Rajasthan)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },
  {
    type: 'node',
    id: 91002009,
    lat: 26.7350,
    lon: 89.0550,
    tags: {
      name: 'Hasimara Air Force Station — Rafale Eastern Squadron (West Bengal)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },
  {
    type: 'node',
    id: 91002010,
    lat: 27.4800,
    lon: 94.9100,
    tags: {
      name: 'Chabua Air Force Station — Eastern Frontline Air Base (Assam)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },
  {
    type: 'node',
    id: 91002011,
    lat: 34.1350,
    lon: 77.5450,
    tags: {
      name: 'Kushok Bakula Rimpochee Airfield / Leh Military Air Base (Ladakh)',
      military: 'airfield',
      operator: 'Indian Air Force',
    },
  },

  // -------------------------------------------------------------------------
  // GLOBAL STRATEGIC & NAVAL BASES
  // -------------------------------------------------------------------------
  {
    type: 'node',
    id: 92001001,
    lat: 35.2900,
    lon: 139.6650,
    tags: {
      name: 'Yokosuka Naval Base (US 7th Fleet / JMSDF, Japan)',
      military: 'naval_base',
      operator: 'US Navy / JMSDF',
    },
  },
  {
    type: 'node',
    id: 92001002,
    lat: 1.3250,
    lon: 104.0150,
    tags: {
      name: 'Changi Naval Base (Singapore)',
      military: 'naval_base',
      operator: 'Republic of Singapore Navy',
    },
  },
  {
    type: 'node',
    id: 92001003,
    lat: -7.3150,
    lon: 72.4150,
    tags: {
      name: 'Diego Garcia Strategic Naval Support Facility (BIOT)',
      military: 'naval_base',
      operator: 'US Navy / Royal Navy',
    },
  },
  {
    type: 'node',
    id: 92001004,
    lat: 26.2400,
    lon: 50.6050,
    tags: {
      name: 'NSA Bahrain — US 5th Fleet Naval Support Activity (Manama)',
      military: 'naval_base',
      operator: 'US Navy',
    },
  },
  {
    type: 'node',
    id: 92001005,
    lat: 49.4400,
    lon: 7.6000,
    tags: {
      name: 'Ramstein Air Base — USAF Europe HQ (Germany)',
      military: 'airfield',
      operator: 'USAF',
    },
  },
  {
    type: 'node',
    id: 92001006,
    lat: 36.9450,
    lon: -76.3250,
    tags: {
      name: 'Naval Station Norfolk — World\'s Largest Naval Base (Virginia, USA)',
      military: 'naval_base',
      operator: 'US Navy',
    },
  },
  {
    type: 'node',
    id: 92001007,
    lat: 21.3650,
    lon: -157.9500,
    tags: {
      name: 'Joint Base Pearl Harbor-Hickam (Hawaii, USA)',
      military: 'naval_base',
      operator: 'US Navy / USAF',
    },
  },
  {
    type: 'node',
    id: 92001008,
    lat: 50.8000,
    lon: -1.1100,
    tags: {
      name: 'HMNB Portsmouth — Royal Navy Naval Base (UK)',
      military: 'naval_base',
      operator: 'Royal Navy',
    },
  },
  // -------------------------------------------------------------------------
  // GLOBAL NUCLEAR POWER PLANTS & FACILITIES (OSIRIS INTELLIGENCE)
  // -------------------------------------------------------------------------
  ...NUCLEAR_FACILITIES.map((fac, idx) => ({
    type: 'node',
    id: 93000000 + idx,
    lat: fac.lat,
    lon: fac.lng,
    tags: {
      name: `${fac.name} (${fac.country}) — Nuclear Power Plant [${fac.capacityMW ? `${fac.capacityMW} MW` : ''}${fac.reactors ? `, ${fac.reactors} reactors` : ''}]`,
      military: 'nuclear_facility',
      operator: fac.owner || fac.country || 'Nuclear Facility',
    },
  })),
  // -------------------------------------------------------------------------
  // GLOBAL ACTIVE CONFLICT ZONES & FRONTLINES (OSIRIS INTELLIGENCE)
  // -------------------------------------------------------------------------
  ...CONFLICT_ZONES.map((zone, idx) => ({
    type: 'node',
    id: 94000000 + idx,
    lat: zone.lat,
    lon: zone.lng,
    tags: {
      name: `${zone.label} — ${zone.description || 'Active Conflict Frontline'}`,
      military: 'conflict_zone',
      operator: zone.severity ? `Conflict Severity: ${zone.severity.toUpperCase()}` : 'Combat Zone',
    },
  })),
  // -------------------------------------------------------------------------
  // GLOBAL MARITIME PORTS & CHOKEPOINTS (OSIRIS INTELLIGENCE)
  // -------------------------------------------------------------------------
  ...GLOBAL_PORTS.map((port, idx) => ({
    type: 'node',
    id: 95000000 + idx,
    lat: port.lat,
    lon: port.lng,
    tags: {
      name: `Port of ${port.name} (${port.country}) — Strategic Maritime Hub [${port.volume || port.type}]`,
      military: 'naval_base',
      operator: 'Strategic Maritime Port',
    },
  })),
];

/**
 * Returns elements within a given bounding box { south, west, north, east }.
 *
 * @param {{ south: number, west: number, north: number, east: number }} box
 * @returns {Array<object>}
 */
export function getCuratedInstallationsInBox(box) {
  const { south, west, north, east } = box;
  return CURATED_MILITARY_INSTALLATIONS.filter((el) => {
    const lat = el.lat;
    const lon = el.lon;
    if (lat < south || lat > north) return false;
    // Dateline wrap handling
    if (west <= east) {
      return lon >= west && lon <= east;
    }
    return lon >= west || lon <= east;
  });
}
