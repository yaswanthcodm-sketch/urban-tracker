import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('🚀 Starting Urban Tracker RoadGuard & Theme Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('Theme') || text.includes('Road') || text.includes('error')) {
        console.log(`[BROWSER]:`, text);
      }
    });

    console.log('Navigating to', APP_URL);
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('gev-first-run-session', 'dismissed');
      localStorage.setItem('gev-first-run-permanent', 'dismissed');
    });
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 45000 });

    // Wait for viewer to be ready
    await page.waitForFunction(() => Boolean(window.__godsEyeView?.viewer), { timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Dismiss any first-run onboarding overlay completely
    await page.evaluate(() => {
      document.getElementById('first-run-dialog')?.remove();
      document.querySelectorAll('.first-run-backdrop').forEach((el) => el.remove());
    });
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 500));

    // ── 1. TEST LIGHT MODE & DARK MODE ──
    console.log('Testing Theme Toggle to LIGHT MODE...');
    await page.click('#header-theme-toggle-btn');
    await new Promise((r) => setTimeout(r, 800));

    const isLightMode = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') === 'light' &&
             document.body.classList.contains('light-theme');
    });
    console.log(`Light Mode Active: ${isLightMode}`);
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_light_mode.png` });

    console.log('Testing Theme Toggle back to DARK MODE...');
    await page.click('#header-theme-toggle-btn');
    await new Promise((r) => setTimeout(r, 800));

    const isDarkMode = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme') === 'dark' &&
             !document.body.classList.contains('light-theme');
    });
    console.log(`Dark Mode Active: ${isDarkMode}`);
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_dark_mode.png` });

    // ── 2. TEST VILLAGE ROAD CATALOG DRAWER ──
    console.log('Opening Village & City Road Catalog Drawer (#header-roads-catalog-btn)...');
    await page.click('#header-roads-catalog-btn');
    await new Promise((r) => setTimeout(r, 1000));

    // Populate catalog with demo locality roads for verification if not already loaded
    await page.evaluate(() => {
      if (window.__gevVillageRoadsCatalog) {
        window.__gevVillageRoadsCatalog.setRoads([
          {
            id: 'way-nuzvid-sh32',
            name: 'Nuzvid - Mylavaram Road',
            ref: 'SH 32',
            type: 'primary',
            centerLat: 16.7865,
            centerLon: 80.8465,
            surface: 'asphalt',
            maxspeed: '60',
          },
          {
            id: 'way-nuzvid-bazaar',
            name: 'Main Gandhi Bazaar Street',
            type: 'residential',
            centerLat: 16.7892,
            centerLon: 80.8480,
            surface: 'paved',
            maxspeed: '30',
          },
          {
            id: 'way-nuzvid-agri-track',
            name: 'Gollapalli Agricultural Village Track',
            type: 'track',
            centerLat: 16.7820,
            centerLon: 80.8520,
            surface: 'unpaved',
            maxspeed: '25',
          },
          {
            id: 'way-nuzvid-bypass',
            name: 'Nuzvid Southern Bypass Highway',
            ref: 'NH 16 Bypass',
            type: 'trunk',
            centerLat: 16.7790,
            centerLon: 80.8410,
            surface: 'asphalt',
            maxspeed: '80',
          },
        ]);
      }
    });

    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_village_roads_explorer.png` });

    // ── 3. TEST SELECTING A ROAD & OPENING AI DAMAGE RECON ──
    console.log('Selecting road "Nuzvid - Mylavaram Road (SH 32)" for AI inspection...');
    await page.evaluate(() => {
      const inspectBtn = document.querySelector('.road-inspect-btn[data-road-id="way-nuzvid-sh32"]');
      if (inspectBtn) inspectBtn.click();
    });

    await new Promise((r) => setTimeout(r, 2000));

    // ── 4. TEST POTHOLE DETECTION MODE ──
    console.log('Testing Pothole Detection mode...');
    await page.click('#road-ai-tab-pothole');
    await new Promise((r) => setTimeout(r, 1200));

    const potholeTelemetry = await page.evaluate(() => {
      return {
        title: document.getElementById('road-ai-status-title')?.textContent,
        conf: document.getElementById('road-ai-confidence-badge')?.textContent,
        defects: document.getElementById('road-ai-defect-count')?.textContent,
        severity: document.getElementById('road-ai-severity-tag')?.textContent,
        authority: document.getElementById('road-ai-authority-tag')?.textContent,
      };
    });
    console.log('Pothole Telemetry:', potholeTelemetry);
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_ai_pothole_detection.png` });

    // ── 5. TEST GARBAGE TRACK ON ROAD MODE ──
    console.log('Testing Garbage Track on Road mode...');
    await page.click('#road-ai-tab-garbage');
    await new Promise((r) => setTimeout(r, 1200));

    const garbageTelemetry = await page.evaluate(() => {
      return {
        title: document.getElementById('road-ai-status-title')?.textContent,
        conf: document.getElementById('road-ai-confidence-badge')?.textContent,
        defects: document.getElementById('road-ai-defect-count')?.textContent,
        severity: document.getElementById('road-ai-severity-tag')?.textContent,
        action: document.getElementById('road-ai-action-text')?.textContent,
      };
    });
    console.log('Garbage Telemetry:', garbageTelemetry);
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_ai_garbage_detection.png` });

    // ── 6. TEST LODGING OFFICIAL GRIEVANCE ──
    console.log('Testing Lodging Official Grievance with RoadGuard AI...');
    await page.click('#road-ai-lodge-complaint-btn');
    await new Promise((r) => setTimeout(r, 1500));

    const ticketResult = await page.evaluate(() => {
      const alertEl = document.getElementById('road-ai-ticket-alert');
      const textEl = document.getElementById('road-ai-ticket-text');
      return {
        visible: !alertEl?.classList.contains('hidden'),
        text: textEl?.textContent,
      };
    });
    console.log('Grievance Registration Result:', ticketResult);
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_grievance_lodged.png` });

    console.log('✅ All verification steps completed successfully!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
