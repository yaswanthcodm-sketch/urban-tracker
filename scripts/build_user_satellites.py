import json

with open('config/satellites_user.json', 'r') as f:
    data = json.load(f)

sats = data['satellites']

with open('src/data/userSatellites.js', 'w') as out:
    out.write('/**\n')
    out.write(' * @module userSatellites\n')
    out.write(' * @description Decoded telemetry catalog and helper API for 1,389 orbital satellites.\n')
    out.write(' */\n\n')
    out.write('export const USER_SATELLITES_METADATA = Object.freeze({\n')
    out.write(f'  total: {data.get("total", len(sats))},\n')
    out.write(f'  categoryCounts: {json.dumps(data.get("category_counts", {}))},\n')
    out.write(f'  source: {json.dumps(data.get("source", "celestrak"))},\n')
    out.write(f'  timestamp: {json.dumps(data.get("timestamp", ""))},\n')
    out.write('});\n\n')
    out.write('export const USER_SATELLITES_RAW = ' + json.dumps(sats, indent=2) + ';\n\n')
    out.write('''
/**
 * Normalized 1,389 satellites with both (lon/lng), altitude in km & meters,
 * category badges, and hex color codes.
 */
export const USER_SATELLITES = Object.freeze(
  USER_SATELLITES_RAW.map((sat) => {
    const noradNum = Number(sat.noradId);
    const lat = Number(sat.lat);
    const lon = Number(sat.lng !== undefined ? sat.lng : sat.lon);
    const altKm = Number(sat.alt);
    const altM = altKm * 1000;
    const cat = sat.category || 'other';
    const mission = sat.mission || 'Unknown';
    const color = sat.color || '#00E5FF';

    let badge = '🛰️';
    if (cat === 'science') badge = '🔬';
    else if (cat === 'military') badge = '🛡️';
    else if (cat === 'earth_obs') badge = mission.includes('Weather') ? '⛅' : '🌍';
    else if (cat === 'comms') badge = '📡';
    else if (cat === 'navigation') badge = '🧭';

    const categoryLabels = {
      science: 'SCIENCE & SPACE STATION',
      military: 'DEFENSE & RECONNAISSANCE',
      earth_obs: 'EARTH OBSERVATION & WEATHER',
      comms: 'COMMUNICATIONS',
      navigation: 'NAVIGATION & GNSS',
      other: 'GENERAL ORBIT & CUBESATS',
    };

    return Object.freeze({
      id: 'sat-' + noradNum,
      noradId: noradNum,
      noradIdStr: String(sat.noradId),
      name: sat.name,
      lat,
      lon,
      lng: lon,
      alt: altKm,
      altM,
      mission,
      color,
      category: cat,
      categoryLabel: categoryLabels[cat] || cat.toUpperCase(),
      badge,
    });
  })
);

const NORAD_MAP = new Map(USER_SATELLITES.map((s) => [s.noradId, s]));

/**
 * Return all decoded user satellites.
 * @returns {readonly object[]}
 */
export function getUserSatellites() {
  return USER_SATELLITES;
}

/**
 * Get a satellite by its NORAD ID.
 * @param {number|string} noradId
 * @returns {object|undefined}
 */
export function getSatelliteByNorad(noradId) {
  return NORAD_MAP.get(Number(noradId));
}

/**
 * Filter satellites by category.
 * @param {string} category
 * @returns {object[]}
 */
export function getSatellitesByCategory(category) {
  if (!category || category === 'all') return USER_SATELLITES;
  return USER_SATELLITES.filter((s) => s.category === category);
}

/**
 * Search satellites by query string across name, NORAD ID, or mission.
 * @param {string} query
 * @returns {object[]}
 */
export function searchSatellites(query) {
  if (!query || !query.trim()) return USER_SATELLITES;
  const q = query.trim().toLowerCase();
  return USER_SATELLITES.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.noradIdStr.includes(q) ||
      s.mission.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
  );
}

/**
 * Calculate dynamic telemetry for a satellite drifting along its orbital track.
 * @param {object} sat
 * @param {Date} [referenceDate]
 * @returns {object}
 */
export function calculateSatelliteTelemetry(sat, referenceDate = new Date()) {
  if (!sat) return null;
  const epoch = new Date(USER_SATELLITES_METADATA.timestamp || '2026-10-17T17:11:20Z').getTime();
  const elapsedSec = (referenceDate.getTime() - epoch) / 1000;

  // Orbital speed approximation for LEO/MEO: v = sqrt(GM / (R_earth + alt))
  const R_earth = 6371; // km
  const r = R_earth + (sat.alt || 500);
  const orbitalPeriodSec = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / 398600.4418); // seconds (~5400-5800s for LEO)
  const speedKmH = Math.round((2 * Math.PI * r / orbitalPeriodSec) * 3600);
  const speedKmS = (speedKmH / 3600).toFixed(2);

  // Dynamic sub-satellite ground drift (longitude advances as orbit progresses minus Earth rotation)
  const driftRateDegPerSec = 360 / orbitalPeriodSec - 360 / 86164; // orbital motion minus Earth rotation
  let currentLon = sat.lon + (elapsedSec * driftRateDegPerSec * 0.1);
  currentLon = ((currentLon + 180) % 360 + 360) % 360 - 180;

  // Approximate sinusoidal latitude oscillation within orbital inclination
  const inclination = Math.min(89, Math.max(10, Math.abs(sat.lat) + 5));
  const phase = (elapsedSec / orbitalPeriodSec) * 2 * Math.PI;
  const currentLat = Math.round(Math.sin(phase) * inclination * 10) / 10;

  let regionName = 'Over Continental Landmass';
  if (currentLat >= 5 && currentLat <= 38 && currentLon >= 65 && currentLon <= 98) {
    regionName = '🇮🇳 Sub-satellite: Indian Subcontinent Sector';
  } else if (currentLat >= -40 && currentLat <= 20 && currentLon >= 40 && currentLon <= 110) {
    regionName = '🌊 Sub-satellite: Indian Ocean Basin';
  } else if (currentLat >= 30 && currentLat <= 70 && currentLon >= -10 && currentLon <= 45) {
    regionName = '🌍 Sub-satellite: European Airspace';
  } else if (currentLat >= 20 && currentLat <= 55 && currentLon >= -130 && currentLon <= -65) {
    regionName = '🌎 Sub-satellite: North American Sector';
  } else if (currentLat >= -50 && currentLat <= 20 && currentLon >= -180 && currentLon <= -70) {
    regionName = '🌊 Sub-satellite: Pacific Ocean Basin';
  } else if (currentLat >= -35 && currentLat <= 5 && currentLon >= -80 && currentLon <= -35) {
    regionName = '🌎 Sub-satellite: South American Sector';
  } else if (currentLat >= -35 && currentLat <= 35 && currentLon >= -20 && currentLon <= 50) {
    regionName = '🌍 Sub-satellite: African Continental Sector';
  } else if (currentLat >= -45 && currentLat <= -10 && currentLon >= 110 && currentLon <= 160) {
    regionName = '🦘 Sub-satellite: Australian Sector';
  } else {
    regionName = '🌐 Sub-satellite: Global Low Earth Orbit';
  }

  return {
    ...sat,
    currentLat,
    currentLon,
    speedKmH,
    speedKmS,
    orbitalPeriodMin: Math.round(orbitalPeriodSec / 60),
    regionName,
  };
}
''')
print('src/data/userSatellites.js generated successfully!')
