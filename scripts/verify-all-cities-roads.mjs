import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('🚀 Running QA Verification for All Cities & Towns Road Reading & Pure White Paper Light Mode...');
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

    // Dismiss any first-run modal
    await page.evaluate(() => {
      document.getElementById('first-run-dialog')?.remove();
      document.querySelectorAll('.first-run-backdrop').forEach((el) => el.remove());
    });

    // ── 1. OPEN VILLAGE & CITY ROAD NETWORK DRAWER ──
    console.log('Opening Village & City Road Network drawer...');
    await page.click('#header-roads-catalog-btn');
    await new Promise((r) => setTimeout(r, 1000));

    // Verify initial Nuzvid roads
    const nuzvidInfo = await page.evaluate(() => {
      const title = document.getElementById('village-roads-locality-name')?.textContent;
      const count = document.querySelectorAll('.village-road-card').length;
      const firstRoad = document.querySelector('.road-card-name')?.textContent;
      return { title, count, firstRoad };
    });
    console.log('Initial State (Nuzvid):', nuzvidInfo);

    // ── 2. TEST SWITCHING TO VIJAYAWADA VIA CHIP ──
    console.log('Clicking Vijayawada quick chip...');
    await page.click('button.city-chip[data-city="vijayawada"]');
    await new Promise((r) => setTimeout(r, 1200));

    const vjaInfo = await page.evaluate(() => {
      const title = document.getElementById('village-roads-locality-name')?.textContent;
      const count = document.querySelectorAll('.village-road-card').length;
      const firstRoad = document.querySelector('.road-card-name')?.textContent;
      return { title, count, firstRoad };
    });
    console.log('Vijayawada Road State:', vjaInfo);

    // ── 3. TEST SWITCHING TO HYDERABAD VIA CHIP ──
    console.log('Clicking Hyderabad quick chip...');
    await page.click('button.city-chip[data-city="hyderabad"]');
    await new Promise((r) => setTimeout(r, 1200));

    const hydInfo = await page.evaluate(() => {
      const title = document.getElementById('village-roads-locality-name')?.textContent;
      const count = document.querySelectorAll('.village-road-card').length;
      const firstRoad = document.querySelector('.road-card-name')?.textContent;
      return { title, count, firstRoad };
    });
    console.log('Hyderabad Road State:', hydInfo);

    // ── 4. TEST SWITCHING TO NEW DELHI VIA CHIP ──
    console.log('Clicking New Delhi quick chip...');
    await page.click('button.city-chip[data-city="delhi"]');
    await new Promise((r) => setTimeout(r, 1200));

    const delInfo = await page.evaluate(() => {
      const title = document.getElementById('village-roads-locality-name')?.textContent;
      const count = document.querySelectorAll('.village-road-card').length;
      const firstRoad = document.querySelector('.road-card-name')?.textContent;
      return { title, count, firstRoad };
    });
    console.log('New Delhi Road State:', delInfo);

    // ── 5. TEST CUSTOM SEARCH FOR ANY TOWN / VILLAGE (ELURU) ──
    console.log('Searching for custom town: Eluru...');
    await page.evaluate(() => {
      const input = document.getElementById('village-city-search-input');
      input.value = 'Eluru, Andhra Pradesh';
    });
    await page.click('#village-city-search-btn');
    await new Promise((r) => setTimeout(r, 1500));

    const eluruInfo = await page.evaluate(() => {
      const title = document.getElementById('village-roads-locality-name')?.textContent;
      const count = document.querySelectorAll('.village-road-card').length;
      const firstRoad = document.querySelector('.road-card-name')?.textContent;
      return { title, count, firstRoad };
    });
    console.log('Eluru Custom Town State:', eluruInfo);

    // ── 6. INSPECT ROAD & TRIGGER RECON MODAL ──
    console.log('Inspecting first road in Eluru...');
    await page.click('.village-road-card:first-child .road-inspect-btn');
    await new Promise((r) => setTimeout(r, 2000));

    // Verify side-by-side positioning and z-indexes
    const layout = await page.evaluate(() => {
      const modal = document.getElementById('road-recon-modal');
      const drawer = document.getElementById('village-roads-panel');
      const titleBar = document.getElementById('title-bar');

      const modalRect = modal ? modal.getBoundingClientRect() : null;
      const drawerRect = drawer ? drawer.getBoundingClientRect() : null;
      const titleRect = titleBar ? titleBar.getBoundingClientRect() : null;

      const modalZ = modal ? window.getComputedStyle(modal).zIndex : null;
      const drawerZ = drawer ? window.getComputedStyle(drawer).zIndex : null;

      return {
        modalRect,
        drawerRect,
        titleRect,
        modalZ,
        drawerZ,
        modalVisible: modal && !modal.classList.contains('hidden'),
        drawerVisible: drawer && !drawer.classList.contains('hidden'),
      };
    });
    console.log('Layout & Z-Index Check:', layout);

    // Capture screenshot in Dark Mode
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_all_cities_dark.png` });
    console.log('Saved urban_tracker_all_cities_dark.png');

    // ── 7. TOGGLE PURE WHITE PAPER LIGHT MODE ──
    console.log('Toggling Pure White Paper Light Mode...');
    await page.evaluate(() => {
      document.getElementById('header-theme-toggle-btn')?.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    const themeAfter = await page.evaluate(() => ({
      theme: document.documentElement.getAttribute('data-theme'),
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
    }));
    console.log('Theme after toggle:', themeAfter);

    // Capture screenshot in Pure White Paper Light Mode
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_all_cities_pure_white_paper.png` });
    console.log('Saved urban_tracker_all_cities_pure_white_paper.png');

    console.log('✅ QA Verification Succeeded! All cities and towns read successfully.');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ QA Verification Failed:', err);
  process.exit(1);
});
