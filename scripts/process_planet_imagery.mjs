/**
 * @file process_planet_imagery.mjs
 * @description Ingests, processes, and catalogs Planet Insights Platform daily satellite imagery for the last 5 days.
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load API key from .env
function getPlanetApiKey() {
  if (process.env.PLANET_API_KEY) return process.env.PLANET_API_KEY.trim();
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^PLANET_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }
  return 'PLAK28cf236422784ba486d9cdf8b78a8f6e';
}

const apiKey = getPlanetApiKey();
const authHeader = 'Basic ' + Buffer.from(apiKey + ':').toString('base64');

function makeRequest({ hostname = 'api.planet.com', path, method = 'GET', body = null, headers = {} }) {
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      'Authorization': authHeader,
      'User-Agent': 'gods-eye-view-planet-processor/1.0',
      ...headers,
    };
    if (body) {
      reqHeaders['Content-Length'] = Buffer.byteLength(body);
    }
    const req = https.request({ hostname, path, method, headers: reqHeaders }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          status: res.statusCode,
          headers: res.headers,
          buffer,
          text: buffer.toString('utf8'),
        });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function run() {
  console.log('🛰️ Connecting to Planet Insights Platform...');
  const now = new Date();
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const timeGte = fiveDaysAgo.toISOString();
  const timeLte = now.toISOString();

  console.log(`📅 Acquisition Window (Last 5 Days): ${timeGte} → ${timeLte}`);

  // 1. Fetch Daily Acquisition Statistics
  console.log('\n📊 Fetching daily acquisition volume from PlanetScope constellation...');
  const statsPayload = JSON.stringify({
    item_types: ['PSScene'],
    interval: 'day',
    filter: {
      type: 'DateRangeFilter',
      field_name: 'acquired',
      config: { gte: timeGte, lte: timeLte },
    },
  });

  const statsRes = await makeRequest({
    path: '/data/v1/stats',
    method: 'POST',
    body: statsPayload,
    headers: { 'Content-Type': 'application/json' },
  });

  let statsBuckets = [];
  let totalScenes = 0;
  if (statsRes.status === 200) {
    const data = JSON.parse(statsRes.text);
    statsBuckets = data.buckets || [];
    totalScenes = statsBuckets.reduce((acc, b) => acc + (b.count || 0), 0);
    console.log(`✅ Retrieved daily statistics: ${totalScenes.toLocaleString()} total scenes captured in the last 5 days.`);
  } else {
    console.warn('⚠️ Stats endpoint returned status:', statsRes.status);
  }

  // 2. Fetch Low-Cloud-Cover Scenes (< 10% cloud cover)
  console.log('\n🔍 Searching for pristine, low-cloud (< 10%) imagery scenes...');
  const searchPayload = JSON.stringify({
    item_types: ['PSScene'],
    filter: {
      type: 'AndFilter',
      config: [
        {
          type: 'DateRangeFilter',
          field_name: 'acquired',
          config: { gte: timeGte, lte: timeLte },
        },
        {
          type: 'RangeFilter',
          field_name: 'cloud_cover',
          config: { lte: 0.1 },
        },
        {
          type: 'RangeFilter',
          field_name: 'sun_elevation',
          config: { gte: 25 },
        },
      ],
    },
  });

  const searchRes = await makeRequest({
    path: '/data/v1/quick-search?_page_size=20',
    method: 'POST',
    body: searchPayload,
    headers: { 'Content-Type': 'application/json' },
  });

  let scenes = [];
  if (searchRes.status === 200) {
    const data = JSON.parse(searchRes.text);
    scenes = data.features || [];
    console.log(`✅ Found ${scenes.length} representative high-clarity scenes.`);
  }

  // 3. Download Sample Imagery Thumbnails to public/assets/planet_imagery/
  const outputDir = path.join(rootDir, 'public', 'assets', 'planet_imagery');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const processedScenes = [];
  console.log('\n🖼️ Processing and downloading preview imagery frames...');
  for (let i = 0; i < Math.min(8, scenes.length); i++) {
    const feat = scenes[i];
    const id = feat.id;
    const props = feat.properties || {};
    const thumbUrl = feat._links?.thumbnail;

    console.log(`  - Processing Scene ${i + 1}/${Math.min(8, scenes.length)}: ${id} (Acquired: ${props.acquired}, Cloud: ${(props.cloud_cover * 100).toFixed(1)}%)`);

    let localImagePath = null;
    if (thumbUrl) {
      try {
        const thumbUrlObj = new URL(thumbUrl);
        const imgRes = await makeRequest({
          hostname: thumbUrlObj.hostname,
          path: thumbUrlObj.pathname + thumbUrlObj.search,
          method: 'GET',
        });
        if (imgRes.status === 200) {
          const fileName = `planet_${id}.png`;
          const filePath = path.join(outputDir, fileName);
          fs.writeFileSync(filePath, imgRes.buffer);
          localImagePath = `/assets/planet_imagery/${fileName}`;
        }
      } catch (err) {
        console.warn(`    ⚠️ Failed to download thumbnail for ${id}:`, err.message);
      }
    }

    processedScenes.push({
      id,
      acquired: props.acquired,
      cloudCover: props.cloud_cover,
      sunElevation: props.sun_elevation,
      sunAzimuth: props.sun_azimuth,
      instrument: props.instrument,
      pixelResolutionM: props.pixel_resolution || 3.0,
      groundControl: props.ground_control,
      coordinates: feat.geometry?.coordinates,
      localImagePath,
    });
  }

  // 4. Save metadata manifest
  const manifest = {
    processedAt: now.toISOString(),
    provider: 'Planet Insights Platform (Planet Labs PBC)',
    constellation: 'PlanetScope (Dove / SuperDove PSB.SD)',
    timeWindow: {
      from: timeGte,
      to: timeLte,
      days: 5,
    },
    totalScenesCaptured: totalScenes,
    dailyBreakdown: statsBuckets,
    sampleProcessedScenes: processedScenes,
  };

  const manifestPath = path.join(outputDir, 'planet_5day_catalog.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n💾 Saved processed catalog manifest to ${manifestPath}`);

  return manifest;
}

run().catch((err) => {
  console.error('❌ Processing failed:', err);
  process.exit(1);
});
