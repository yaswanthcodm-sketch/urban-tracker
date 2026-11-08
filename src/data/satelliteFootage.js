/**
 * @module satelliteFootage
 * @description Catalog, resolver, and proxy helpers for Near-Real-Time (NRT) satellite
 * Earth imagery, 10-30 min geostationary frames, 1-3 hour polar overpasses, and multi-hour
 * animated timelapse footage loops (NOAA GOES-18/19, ISRO INSAT-3D/3DR, NASA GIBS VIIRS/MODIS, ISS).
 */

/**
 * Approved upstream domains permitted through the footage proxy.
 */
export const ALLOWED_FOOTAGE_HOSTS = Object.freeze(new Set([
  'cdn.star.nesdis.noaa.gov',
  'www.star.nesdis.noaa.gov',
  'mausam.imd.gov.in',
  'wvs.earthdata.nasa.gov',
  'gibs.earthdata.nasa.gov',
  'tilecache.rainviewer.com',
  'api.rainviewer.com',
]));

/**
 * Validates whether an upstream URL belongs to an allowed scientific/meteorological host.
 * @param {string} rawUrl
 * @returns {boolean}
 */
export function isAllowedFootageHost(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return ALLOWED_FOOTAGE_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Computes the optimal UTC snapshot date for NASA GIBS NRT imagery.
 * When earlier than 04:00 UTC, the previous day's polar orbit overpass mosaic is used
 * to guarantee complete global data coverage.
 * @param {Date} [referenceDate=new Date()]
 * @returns {string} ISO Date string YYYY-MM-DD
 */
export function getGibsSnapshotDate(referenceDate = new Date()) {
  const d = new Date(referenceDate);
  if (d.getUTCHours() < 4) {
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return d.toISOString().split('T')[0];
}

/**
 * Generates a NASA GIBS Web Snapshot URL for true-color satellite reflectance.
 * @param {string} [layer='VIIRS_SNPP_CorrectedReflectance_TrueColor']
 * @param {string} [bbox='-60,-180,60,180']
 * @param {number} [width=1280]
 * @param {number} [height=640]
 * @param {Date} [date]
 * @returns {string}
 */
export function getGibsSnapshotUrl(
  layer = 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
  bbox = '-60,-180,60,180',
  width = 1280,
  height = 640,
  date = new Date(),
) {
  const dateStr = getGibsSnapshotDate(date);
  return `https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&TIME=${dateStr}&BBOX=${bbox}&CRS=EPSG:4326&LAYERS=${layer}&FORMAT=image/jpeg&WIDTH=${width}&HEIGHT=${height}`;
}

/**
 * Catalog of Near-Real-Time (NRT) satellite footage, timelapse loops, and live streams.
 */
export const SATELLITE_FOOTAGE_FEEDS = Object.freeze([
  {
    id: 'noaa-goes19-geocolor',
    aliases: ['goes19', 'goes-19', 'goes-east', 'noaa-goes-east', 'noaa19-fd', 'goes19-fd'],
    name: 'NOAA GOES-19 GeoColor (Full Earth Disk)',
    satellite: 'GOES-19 (GOES-East)',
    agency: 'NOAA / NESDIS',
    region: 'Americas, Atlantic, Caribbean & Africa',
    category: 'earth_obs',
    cadence: '10 minutes',
    cadenceMinutes: 10,
    format: 'image/jpeg',
    resolution: '1808x1808 (High-Res Full Disk)',
    type: 'frame',
    badge: '10-MIN NRT',
    upstreamUrl: 'https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/1808x1808.jpg',
    upstreamFallbackUrl: 'https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/678x678.jpg',
    upstreamFramesSource: 'https://www.star.nesdis.noaa.gov/GOES/fulldisk_band.php?sat=G19&band=GEOCOLOR&length=12',
    frameEndpoint: '/api/satellites/footage/frame/noaa-goes19-geocolor',
    framesEndpoint: '/api/satellites/footage/frames/noaa-goes19-geocolor',
    description: 'Multispectral GeoColor composite combining true color optical imagery by day and infrared heat sensing by night. Updated every 10 minutes from geostationary orbit.',
  },
  {
    id: 'noaa-goes18-geocolor',
    aliases: ['goes18', 'goes-18', 'goes-west', 'noaa-goes-west', 'goes18-fd'],
    name: 'NOAA GOES-18 GeoColor (Pacific Full Disk)',
    satellite: 'GOES-18 (GOES-West)',
    agency: 'NOAA / NESDIS',
    region: 'Pacific Ocean, Hawaii, Alaska & West Coast',
    category: 'earth_obs',
    cadence: '10 minutes',
    cadenceMinutes: 10,
    format: 'image/jpeg',
    resolution: '1808x1808 (High-Res Full Disk)',
    type: 'frame',
    badge: '10-MIN NRT',
    upstreamUrl: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/FD/GEOCOLOR/1808x1808.jpg',
    upstreamFallbackUrl: 'https://cdn.star.nesdis.noaa.gov/GOES18/ABI/FD/GEOCOLOR/678x678.jpg',
    upstreamFramesSource: 'https://www.star.nesdis.noaa.gov/GOES/fulldisk_band.php?sat=G18&band=GEOCOLOR&length=12',
    frameEndpoint: '/api/satellites/footage/frame/noaa-goes18-geocolor',
    framesEndpoint: '/api/satellites/footage/frames/noaa-goes18-geocolor',
    description: '10-minute cadence multispectral Earth observation covering the entire Pacific Basin, Western North America, and ocean storm patterns.',
  },
  {
    id: 'insat-3d-asia-ir1',
    aliases: ['insat', 'insat3d', 'insat-3d', 'insat-3dr', 'insat-ir', 'insat-asia-ir1', 'cartosat-sector'],
    name: 'ISRO / IMD INSAT-3D Asia Sector Infrared',
    satellite: 'INSAT-3D / 3DR (ISRO)',
    agency: 'ISRO / IMD',
    region: 'India, South Asia, Indian Ocean & Middle East',
    category: 'earth_obs',
    cadence: '15-30 minutes',
    cadenceMinutes: 15,
    format: 'image/jpeg',
    resolution: '1024x1024',
    type: 'frame',
    badge: '15-30M ISRO',
    upstreamUrl: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ir1.jpg',
    frameEndpoint: '/api/satellites/footage/frame/insat-3d-asia-ir1',
    loopEndpoint: '/api/satellites/footage/loop/insat-loop-ir1',
    description: 'Thermal infrared 1 (10.8 µm) channel tracking deep convective storm clouds, cyclonic circulations, and monsoon weather over the Indian subcontinent.',
  },
  {
    id: 'insat-3d-asia-vis',
    aliases: ['insat-vis', 'insat-3d-vis', 'insat-asia-vis'],
    name: 'ISRO / IMD INSAT-3D Asia Visible Optical',
    satellite: 'INSAT-3D / 3DR (ISRO)',
    agency: 'ISRO / IMD',
    region: 'India & South Asia Daytime',
    category: 'earth_obs',
    cadence: '15-30 minutes',
    cadenceMinutes: 15,
    format: 'image/jpeg',
    resolution: '1024x1024',
    type: 'frame',
    badge: '15-30M ISRO',
    upstreamUrl: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_vis.jpg',
    frameEndpoint: '/api/satellites/footage/frame/insat-3d-asia-vis',
    loopEndpoint: '/api/satellites/footage/loop/insat-loop-vis',
    description: 'High-definition visible reflectance optical satellite photography over India capturing cloud formations, snow in the Himalayas, and ocean winds.',
  },
  {
    id: 'insat-3d-globe-ir1',
    aliases: ['insat-globe', 'insat-globe-ir1', 'insat-3d-globe'],
    name: 'ISRO / IMD INSAT-3D Full Globe Infrared',
    satellite: 'INSAT-3D / 3DR (ISRO)',
    agency: 'ISRO / IMD',
    region: 'Indian Ocean, Africa, Asia & Australia',
    category: 'earth_obs',
    cadence: '15-30 minutes',
    cadenceMinutes: 15,
    format: 'image/jpeg',
    resolution: '1024x1024',
    type: 'frame',
    badge: '15-30M ISRO',
    upstreamUrl: 'https://mausam.imd.gov.in/Satellite/3Dglobe_ir1.jpg',
    frameEndpoint: '/api/satellites/footage/frame/insat-3d-globe-ir1',
    description: 'Full hemisphere geostationary infrared view anchored over 74°E longitude, observing oceanic cloud systems across the Eastern Hemisphere.',
  },
  {
    id: 'insat-loop-ir1',
    aliases: ['insat-loop', 'stormloop', 'storm-loop', 'india-loop', 'insat-gif'],
    name: 'ISRO / IMD 3-Hour Rapid Storm & Cloud Loop',
    satellite: 'INSAT-3D / 3DR (ISRO)',
    agency: 'ISRO / IMD',
    region: 'India & Surrounding Seas',
    category: 'earth_obs',
    cadence: 'Multi-hour Timelapse (Updated every 15-30 min)',
    cadenceMinutes: 15,
    format: 'image/gif',
    resolution: '1024x1024 Animated',
    type: 'loop',
    badge: '3-HOUR LOOP',
    upstreamUrl: 'https://mausam.imd.gov.in/Satellite/Converted/IR1.gif',
    frameEndpoint: '/api/satellites/footage/loop/insat-loop-ir1',
    loopEndpoint: '/api/satellites/footage/loop/insat-loop-ir1',
    description: 'Continuous 3-to-6 hour animated satellite loop displaying real cloud movement, storm intensification, and atmospheric dynamics across India.',
  },
  {
    id: 'insat-loop-vis',
    aliases: ['insat-vis-loop', 'vis-loop'],
    name: 'ISRO / IMD Visible Daytime Cloud Motion Loop',
    satellite: 'INSAT-3D / 3DR (ISRO)',
    agency: 'ISRO / IMD',
    region: 'India & South Asia',
    category: 'earth_obs',
    cadence: 'Daytime Timelapse (Updated every 15-30 min)',
    cadenceMinutes: 15,
    format: 'image/gif',
    resolution: '1024x1024 Animated',
    type: 'loop',
    badge: 'DAYTIME LOOP',
    upstreamUrl: 'https://mausam.imd.gov.in/Satellite/Converted/VIS.gif',
    frameEndpoint: '/api/satellites/footage/loop/insat-loop-vis',
    loopEndpoint: '/api/satellites/footage/loop/insat-loop-vis',
    description: 'Daylight visible optical animation showing real-time cloud propagation over the subcontinent.',
  },
  {
    id: 'nasa-viirs-snpp',
    aliases: ['viirs', 'viirs-truecolor', 'nasa-viirs', 'suomi-npp'],
    name: 'NASA VIIRS SNPP NRT True Color (1-3h Overpass)',
    satellite: 'Suomi-NPP (VIIRS Sensor)',
    agency: 'NASA Earthdata GIBS',
    region: 'Global Near-Real-Time Swath Mosaic',
    category: 'science',
    cadence: '1-3 hours (Polar Orbit Passes)',
    cadenceMinutes: 90,
    format: 'image/jpeg',
    resolution: '1280x640 True Color',
    type: 'frame',
    badge: '1-3H OVERPASS',
    getDynamicUpstreamUrl: () => getGibsSnapshotUrl('VIIRS_SNPP_CorrectedReflectance_TrueColor', '-60,-180,60,180', 1280, 640),
    frameEndpoint: '/api/satellites/footage/frame/nasa-viirs-snpp',
    description: 'Near-real-time Corrected Reflectance True Color imagery from the VIIRS sensor aboard Suomi-NPP. Updated every 1 to 3 hours as orbits complete.',
  },
  {
    id: 'nasa-modis-terra',
    aliases: ['modis', 'modis-terra', 'terra-nrt'],
    name: 'NASA MODIS Terra NRT True Color (1-3h Overpass)',
    satellite: 'Terra (EOS AM-1)',
    agency: 'NASA Earthdata GIBS',
    region: 'Global Near-Real-Time Swath Mosaic',
    category: 'science',
    cadence: '1-3 hours (Polar Orbit Passes)',
    cadenceMinutes: 120,
    format: 'image/jpeg',
    resolution: '1280x640 True Color',
    type: 'frame',
    badge: '1-3H OVERPASS',
    getDynamicUpstreamUrl: () => getGibsSnapshotUrl('MODIS_Terra_CorrectedReflectance_TrueColor', '-60,-180,60,180', 1280, 640),
    frameEndpoint: '/api/satellites/footage/frame/nasa-modis-terra',
    description: 'Global 1-3 hour overpass reflectance from NASA Terra satellite, highlighting natural colors of oceans, continents, and storm clouds.',
  },
  {
    id: 'iss-live-hls',
    aliases: ['iss', 'iss-live', 'iss-stream', 'space-station', '25544'],
    name: 'NASA ISS 24/7 HD Live Space Feed',
    satellite: 'ISS (ZARYA) #25544',
    agency: 'NASA',
    region: 'Global Low Earth Orbit (420 km Altitude)',
    category: 'science',
    cadence: 'Realtime Live Video (24/7)',
    cadenceMinutes: 0,
    format: 'video/embed',
    resolution: '1080p HD Video',
    type: 'live_stream',
    badge: '🔴 24/7 LIVE',
    streamUrl: 'https://www.youtube-nocookie.com/embed/P9C25Un7xaM?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0',
    description: 'Continuous real-time high-definition video camera looking down upon Earth from the International Space Station traveling at 27,600 km/h.',
  },
]);

/**
 * Resolves a satellite footage source by its ID, alias, or satellite name.
 * @param {string} query
 * @returns {object|null}
 */
export function resolveFootageSource(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim().toLowerCase();

  for (const feed of SATELLITE_FOOTAGE_FEEDS) {
    if (feed.id.toLowerCase() === q) return feed;
    if (feed.aliases && feed.aliases.some((a) => a.toLowerCase() === q)) return feed;
    if (feed.name.toLowerCase().includes(q) || feed.satellite.toLowerCase().includes(q)) return feed;
  }
  return null;
}

/**
 * Returns the public catalog summary of all available footage and imagery feeds.
 * @returns {object}
 */
export function getFootageCatalog() {
  return {
    service: "God's Eye View - Near-Real-Time Satellite Earth Imagery & Footage API",
    timestamp: new Date().toISOString(),
    total_feeds: SATELLITE_FOOTAGE_FEEDS.length,
    update_cadences: [
      '10-Minute Geostationary (NOAA GOES-18/19 GeoColor Full Disk)',
      '15-30 Minute Subcontinent (ISRO INSAT-3D/3DR India & Asia Multispectral)',
      '1-3 Hour Global Overpasses (NASA GIBS VIIRS SNPP & MODIS Terra NRT True Color)',
      '3-Hour Animated Loops (ISRO Rapid Convective Storm Timelapses)',
      '24/7 Continuous Live HD Stream (NASA ISS Live Earth Views)',
    ],
    api_routes: {
      catalog: '/api/satellites/footage',
      frame: '/api/satellites/footage/frame/:sourceId',
      loop: '/api/satellites/footage/loop/:sourceId',
      frames: '/api/satellites/footage/frames/:sourceId',
      proxy: '/api/satellites/footage/proxy?url=<encodedUrl>',
      imagery_alias: '/api/satellites/imagery',
    },
    feeds: SATELLITE_FOOTAGE_FEEDS.map((f) => ({
      id: f.id,
      name: f.name,
      satellite: f.satellite,
      agency: f.agency,
      region: f.region,
      category: f.category,
      cadence: f.cadence,
      cadence_minutes: f.cadenceMinutes,
      format: f.format,
      resolution: f.resolution,
      type: f.type,
      badge: f.badge,
      frame_url: f.frameEndpoint || null,
      loop_url: f.loopEndpoint || null,
      frames_url: f.framesEndpoint || null,
      stream_url: f.streamUrl || null,
      description: f.description,
    })),
  };
}

/**
 * Generates an SVG fallback image for a satellite when upstream data is syncing or calibrating.
 * @param {string} title
 * @param {string} sourceId
 * @param {string} [subtitle='SENSOR PASS COMPILING']
 * @returns {string} SVG xml content
 */
export function generateSatelliteFallbackSvg(title, sourceId, subtitle = 'SENSOR PASS COMPILING') {
  const time = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="satbg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#071b2e" />
      <stop offset="100%" stop-color="#020912" />
    </radialGradient>
    <linearGradient id="satcyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="transparent" />
      <stop offset="50%" stop-color="#00f6ff" />
      <stop offset="100%" stop-color="transparent" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#satbg)" />
  <circle cx="400" cy="300" r="180" fill="none" stroke="#00f6ff" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.35" />
  <circle cx="400" cy="300" r="110" fill="none" stroke="#00f6ff" stroke-width="1" opacity="0.3" />
  <circle cx="400" cy="300" r="4" fill="#00f6ff" />
  <line x1="100" y1="300" x2="700" y2="300" stroke="#00f6ff" stroke-width="0.5" opacity="0.2" />
  <line x1="400" y1="50" x2="400" y2="550" stroke="#00f6ff" stroke-width="0.5" opacity="0.2" />
  <rect x="50" y="40" width="700" height="3" fill="url(#satcyan)" />
  <text x="400" y="80" text-anchor="middle" font-family="monospace" font-size="20" font-weight="bold" fill="#00f6ff" letter-spacing="2">🛰️ GOD'S EYE SATELLITE INTELLIGENCE</text>
  <text x="400" y="115" text-anchor="middle" font-family="monospace" font-size="14" fill="#e0f4ff" opacity="0.9">${String(title || 'SATELLITE FOOTAGE').toUpperCase()}</text>
  <text x="400" y="270" text-anchor="middle" font-family="monospace" font-size="13" fill="#00ff88" letter-spacing="1.5">● ${subtitle}</text>
  <text x="400" y="340" text-anchor="middle" font-family="monospace" font-size="11" fill="#88c0d0">ORBITAL PASS REFRESH IN PROGRESS</text>
  <text x="400" y="365" text-anchor="middle" font-family="monospace" font-size="10" fill="#a0aec0">CADENCE: 10m / 30m / 1-3 HOURS SYNCHRONIZATION ACTIVE</text>
  <text x="400" y="520" text-anchor="middle" font-family="monospace" font-size="11" fill="#718096">TIMESTAMP: ${time} · SOURCE: ${String(sourceId || 'ORBITAL').toUpperCase()}</text>
  <rect x="50" y="555" width="700" height="3" fill="url(#satcyan)" />
</svg>`;
}
