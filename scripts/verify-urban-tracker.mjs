import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173';
const OUTPUT_SHOT = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/urban_tracker_flights_moving.png';

const CHROME_EXECUTABLE_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);

function findChromeExecutable() {
  for (const candidate of CHROME_EXECUTABLE_CANDIDATES) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch { /* ignore */ }
  }
  return null;
}

async function run() {
  console.log('Launching browser to verify URBAN TRACKER LIVE FLIGHTS at', APP_URL);
  const chromeExecutable = findChromeExecutable();
  const browser = await puppeteer.launch({
    headless: 'new',
    ...(chromeExecutable ? { executablePath: chromeExecutable } : {}),
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--disable-dev-shm-usage',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--window-size=1600,900',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  console.log('Navigating to', APP_URL);
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  console.log('Waiting for window.__godsEyeView...');
  const start = Date.now();
  let initialized = false;
  while (Date.now() - start < 60000) {
    const status = await page.evaluate(() => {
      const loaderStatus = document.getElementById('loading-status')?.innerText;
      const gev = window.__godsEyeView;
      return { loaderStatus, hasGev: !!gev, hasViewer: !!gev?.viewer };
    });
    if (status.hasViewer) {
      initialized = true;
      break;
    }
    console.log(`[${Math.round((Date.now() - start)/1000)}s] Status: "${status.loaderStatus}" | hasGev: ${status.hasGev}`);
    await new Promise(r => setTimeout(r, 2000));
  }

  if (!initialized) {
    throw new Error('Timed out waiting for viewer after 60s');
  }
  console.log('Cesium initialized successfully!');

  // Let loading cover clear
  await new Promise(r => setTimeout(r, 2000));

  // Dismiss first-run launcher and open left data panel
  await page.evaluate(() => {
    const launcher = document.getElementById('first-run-launcher');
    if (launcher) launcher.classList.remove('visible');
    const dataPanel = document.getElementById('data-panel');
    if (dataPanel) dataPanel.classList.remove('collapsed');
  });

  // Enable Live Flights and AIS Vessels
  console.log('Enabling Live Flights layer...');
  await page.evaluate(async () => {
    const dm = window.__godsEyeView?.dataManager;
    if (dm) {
      try {
        await dm.setEnabled('flights', true);
      } catch (e) {
        console.error('Error enabling flights:', e);
      }
      try {
        await dm.setEnabled('ais-live-vessels', true);
      } catch (e) {
        console.error('Error enabling ais-live-vessels:', e);
      }
    }
  });

  // Wait 3 seconds for initial flight positions to load
  await new Promise(r => setTimeout(r, 3000));

  // Check initial flight positions
  const t0Positions = await page.evaluate(() => {
    const dm = window.__godsEyeView?.dataManager;
    const flightsLayer = dm?.getAll?.()?.find(l => l.id === 'flights');
    const flightCount = flightsLayer?.stats?.count || 0;

    // Read billboards from flight layer
    const viewer = window.__godsEyeView?.viewer;
    const prims = viewer?.scene?.primitives;
    const sampledPlanes = [];

    if (prims) {
      for (let i = 0; i < prims.length; i++) {
        const p = prims.get(i);
        if (p && typeof p.get === 'function' && p.length > 0) {
          // Check if this is the flights billboard collection
          for (let j = 0; j < Math.min(p.length, 10); j++) {
            const bb = p.get(j);
            if (bb && typeof bb.id === 'string' && bb.position) {
              sampledPlanes.push({
                id: bb.id,
                x: bb.position.x,
                y: bb.position.y,
                z: bb.position.z
              });
            }
          }
          if (sampledPlanes.length > 0) break;
        }
      }
    }

    return { flightCount, sampledPlanes };
  });

  console.log(`Initial Flights Count: ${t0Positions.flightCount}, sampled airplanes: ${t0Positions.sampledPlanes.length}`);

  // Wait 3 seconds to let dead-reckoning advance planes in flight
  console.log('Waiting 3 seconds to measure continuous flight movement...');
  await new Promise(r => setTimeout(r, 3500));

  // Check positions at T = 3.5s to verify movement
  const movementCheck = await page.evaluate((initialSamples) => {
    const viewer = window.__godsEyeView?.viewer;
    const prims = viewer?.scene?.primitives;
    const movements = [];

    if (prims && initialSamples.length > 0) {
      for (let i = 0; i < prims.length; i++) {
        const p = prims.get(i);
        if (p && typeof p.get === 'function' && p.length > 0) {
          for (const initial of initialSamples) {
            for (let j = 0; j < p.length; j++) {
              const bb = p.get(j);
              if (bb && bb.id === initial.id && bb.position) {
                const dx = bb.position.x - initial.x;
                const dy = bb.position.y - initial.y;
                const dz = bb.position.z - initial.z;
                const distM = Math.hypot(dx, dy, dz);
                movements.push({ id: initial.id, distM, moved: distM > 5 });
                break;
              }
            }
          }
          if (movements.length > 0) break;
        }
      }
    }

    return movements;
  }, t0Positions.sampledPlanes);

  console.log('Flight movement verification results:');
  for (const m of movementCheck) {
    console.log(`  ✈️ Plane ${m.id}: moved ${Math.round(m.distM)} meters across map (in-flight: ${m.moved})`);
  }

  // Position camera to frame India view to clearly see the active air corridor
  console.log('Framing camera over India air corridors...');
  await page.evaluate(() => {
    const viewer = window.__godsEyeView?.viewer;
    const Cesium = window.Cesium;
    if (viewer && Cesium) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(78.5, 21.0, 3600000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-85),
          roll: 0
        },
        duration: 0
      });
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // Take screenshot
  await page.screenshot({ path: OUTPUT_SHOT, fullPage: false });
  console.log('Screenshot of live moving flights captured to:', OUTPUT_SHOT);

  await browser.close();
}

run().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
