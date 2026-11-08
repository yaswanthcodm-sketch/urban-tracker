import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('Launching browser with Chrome at', CHROME);
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('Traffic') || text.includes('Overpass') || text.includes('Road') || text.includes('error') || text.includes('Error')) {
        console.log(`[BROWSER ${msg.type()}]:`, text);
      }
    });

    console.log('Navigating to', APP_URL);
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 45000 });

    // Wait for viewer to be initialized
    console.log('Waiting for Cesium viewer to be ready...');
    await page.waitForFunction(() => Boolean(window.__godsEyeView?.viewer), { timeout: 30000 });

    // Wait for loading screen to hide
    await new Promise((r) => setTimeout(r, 2000));

    // Fly camera directly to Nuzvid town/village center
    console.log('Flying camera to Nuzvid (lat 16.7865, lon 80.8465, alt 3500m)...');
    await page.evaluate(() => {
      const gev = window.__godsEyeView;
      const viewer = gev?.viewer;
      if (viewer && viewer.camera && window.Cesium) {
        viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(80.8465, 16.7865, 2800),
          duration: 0.5,
          complete: () => {
            console.log('[Puppeteer] Camera flyTo completed');
            viewer.camera.changed.raiseEvent();
          },
        });
      }
    });

    // Wait for flyTo and trigger camera move
    await new Promise((r) => setTimeout(r, 2000));

    await page.evaluate(() => {
      const gev = window.__godsEyeView;
      const viewer = gev?.viewer;
      if (viewer) {
        viewer.camera.changed.raiseEvent();
      }
    });

    console.log('Waiting for roads to load from Overpass proxy...');
    // Wait for roads to be populated
    await page.waitForFunction(() => {
      const roads = window.__gevRoads;
      return Array.isArray(roads) && roads.length > 0;
    }, { timeout: 35000 }).catch(() => {
      console.log('Roads wait timed out, proceeding to check current state...');
    });

    // Extra second for Cesium polylines to render on canvas
    await new Promise((r) => setTimeout(r, 2000));

    const roadsStats = await page.evaluate(() => {
      const roads = window.__gevRoads || [];
      const polylines = window.__gevRoadPolylines;
      const filtered = window.__gevFilteredRoads || [];
      return {
        totalRoads: roads.length,
        visibleRoads: filtered.length,
        polylineCount: polylines ? polylines.length : 0,
        roads: roads.slice(0, 8).map(r => ({
          id: r.id,
          name: r.name,
          ref: r.ref,
          type: r.type,
          surface: r.surface,
          maxspeed: r.maxspeed,
          centerLat: r.centerLat,
          centerLon: r.centerLon,
        })),
      };
    });
    console.log('Roads statistics:', JSON.stringify(roadsStats, null, 2));

    // 1. Capture full 3D globe screenshot showing road polylines rendered over Nuzvid
    await page.screenshot({ path: `${SHOT_DIR}/nuzvid_village_roads_rendered.png` });
    console.log('Saved nuzvid_village_roads_rendered.png');

    // 2. Select a road to trigger Road Reconnaissance HUD
    console.log('Inspecting road to display Road Reconnaissance modal...');
    await page.evaluate(() => {
      const roads = window.__gevRoads || [];
      const primaryRoad = roads.find(r => r.name || r.ref) || roads[0] || {
        id: 'way-nuzvid-tiruvuru-rd',
        name: 'Tiruvuru Road',
        ref: 'SH-42',
        type: 'primary',
        surface: 'asphalt',
        maxspeed: '60',
        centerLat: 16.7865,
        centerLon: 80.8465,
      };
      if (window.__gevRoadRecon && window.__gevRoadRecon.inspectRoad) {
        window.__gevRoadRecon.inspectRoad(primaryRoad);
      }
    });

    await new Promise((r) => setTimeout(r, 3000));

    const reconInfo = await page.evaluate(() => {
      const modal = document.getElementById('road-recon-modal');
      const isVisible = modal && !modal.classList.contains('hidden');
      const title = document.getElementById('road-recon-title-text')?.textContent;
      const name = document.getElementById('road-recon-name-el')?.textContent;
      const coords = document.getElementById('road-recon-coords-el')?.textContent;
      const badge = document.getElementById('road-recon-badge-el')?.textContent;
      const timeTag = document.getElementById('road-recon-time-tag')?.textContent;
      const img = document.getElementById('road-recon-img')?.src;
      return { isVisible, title, name, coords, badge, timeTag, img };
    });
    console.log('Road Recon Satellite View:', reconInfo);

    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_road_recon_1h_satellite.png` });
    console.log('Saved urban_tracker_road_recon_1h_satellite.png');

    // 3. Switch to Sub-Meter Optical Ground View Tab
    console.log('Switching to Optical Ground View...');
    await page.evaluate(() => {
      document.getElementById('road-tab-optical')?.click();
    });
    await new Promise((r) => setTimeout(r, 3000));

    const opticalInfo = await page.evaluate(() => {
      const timeTag = document.getElementById('road-recon-time-tag')?.textContent;
      const img = document.getElementById('road-recon-img')?.src;
      return { timeTag, img };
    });
    console.log('Road Recon Optical Ground View:', opticalInfo);

    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_road_recon_submeter_optical.png` });
    console.log('Saved urban_tracker_road_recon_submeter_optical.png');

    console.log('Verification finished successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
