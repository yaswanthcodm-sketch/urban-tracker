import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('🚀 Running QA Verification for Nuzvid Road Scanning & Pure White Paper Light Mode...');
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
      if (text.includes('VillageRoads') || text.includes('Theme') || text.includes('error')) {
        console.log(`[BROWSER]:`, text);
      }
    });

    console.log('Navigating to', APP_URL);
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('gev-first-run-session', 'dismissed');
      localStorage.setItem('gev-first-run-permanent', 'dismissed');
    });

    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.waitForFunction(() => Boolean(window.__godsEyeView?.viewer), { timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Dismiss any modal overlay
    await page.evaluate(() => {
      document.getElementById('first-run-dialog')?.remove();
      document.querySelectorAll('.first-run-backdrop').forEach((el) => el.remove());
    });

    // ── 1. TEST PURE WHITE PAPER LIGHT MODE ──
    console.log('Testing Pure White Paper Light Mode...');
    await page.click('#header-theme-toggle-btn');
    await new Promise((r) => setTimeout(r, 1200));

    const lightState = await page.evaluate(() => {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
      const cesiumBg = window.getComputedStyle(document.getElementById('cesiumContainer')).backgroundColor;
      return { bodyBg, htmlBg, cesiumBg, theme: document.documentElement.getAttribute('data-theme') };
    });
    console.log('Light Mode Colors:', lightState);
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_pure_white_light_mode.png` });

    // Switch back to Dark Mode for next test
    await page.click('#header-theme-toggle-btn');
    await new Promise((r) => setTimeout(r, 800));

    // ── 2. TEST SEARCHING "NUZVID" EXACTLY LIKE THE USER ──
    console.log('Typing "nuzvid" in header search input...');
    await page.click('#header-search-input');
    await page.$eval('#header-search-input', (el) => { el.value = ''; });
    await page.type('#header-search-input', 'nuzvid');
    await page.keyboard.press('Enter');

    // Wait for geocoder and scan to process
    await new Promise((r) => setTimeout(r, 2500));

    // Verify roads are scanned and loaded in drawer
    const roadScanResult = await page.evaluate(() => {
      const panel = document.getElementById('village-roads-panel');
      const locality = document.getElementById('village-roads-locality-name')?.textContent;
      const cards = document.querySelectorAll('.village-road-card');
      const countAll = document.getElementById('count-roads-all')?.textContent;
      const countMajor = document.getElementById('count-roads-major')?.textContent;
      const countRes = document.getElementById('count-roads-res')?.textContent;
      const countTrack = document.getElementById('count-roads-track')?.textContent;
      const panelZIndex = window.getComputedStyle(panel).zIndex;
      const panelTop = window.getComputedStyle(panel).top;
      const panelRight = window.getComputedStyle(panel).right;

      const roadNames = Array.from(cards).slice(0, 6).map((c) => c.querySelector('.road-card-name')?.textContent);

      return {
        panelVisible: !panel?.classList.contains('hidden'),
        locality,
        totalRoads: cards.length,
        counts: { all: countAll, major: countMajor, res: countRes, track: countTrack },
        position: { zIndex: panelZIndex, top: panelTop, right: panelRight },
        sampleRoads: roadNames,
      };
    });

    console.log('Road Scan Result for Nuzvid:', roadScanResult);
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_nuzvid_roads_scanned.png` });

    // ── 3. TEST SELECTING A ROAD IN NUZVID ──
    console.log('Selecting first road in Nuzvid list...');
    await page.evaluate(() => {
      const firstInspectBtn = document.querySelector('.road-inspect-btn');
      if (firstInspectBtn) firstInspectBtn.click();
    });

    await new Promise((r) => setTimeout(r, 2000));

    const reconModalState = await page.evaluate(() => {
      const recon = document.getElementById('road-recon-modal');
      const title = document.getElementById('road-recon-title-text')?.textContent;
      const name = document.getElementById('road-recon-name-el')?.textContent;
      const coords = document.getElementById('road-recon-coords-el')?.textContent;
      const reconZIndex = window.getComputedStyle(recon).zIndex;
      const reconTop = window.getComputedStyle(recon).top;
      const reconRight = window.getComputedStyle(recon).right;

      return {
        visible: !recon?.classList.contains('hidden'),
        title,
        name,
        coords,
        position: { zIndex: reconZIndex, top: reconTop, right: reconRight },
      };
    });

    console.log('Recon Modal State for selected road:', reconModalState);
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_nuzvid_side_by_side.png` });

    // ── 4. TEST PURE WHITE PAPER LIGHT MODE WITH ROADS & RECON ACTIVE ──
    console.log('Testing Pure White Paper Light Mode with Road Recon active...');
    await page.click('#header-theme-toggle-btn');
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_pure_white_road_recon.png` });

    console.log('✅ QA Verification completed successfully!');
  } catch (err) {
    console.error('❌ QA Verification failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
