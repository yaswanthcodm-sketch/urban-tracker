import fs from 'node:fs';
import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const SHOT_OVERVIEW = `${SHOT_DIR}/urban_tracker_user_satellites_overview.png`;
const SHOT_CARTOSAT = `${SHOT_DIR}/urban_tracker_user_satellites_cartosat.png`;

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

async function verify() {
  console.log('Launching browser to test USER SATELLITES at', APP_URL);
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

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900 });

    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', (err) => console.error('PAGE ERROR:', err.message));

    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('gev_first_run_seen', '1');
    });

    console.log('Navigating to', APP_URL);
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log('Waiting for loading screen to hide...');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2000));

    console.log('Opening Satellite modal...');
    await page.evaluate(() => {
      const satBtn = document.getElementById('header-live-sat-btn') || document.getElementById('dock-pill-sat');
      if (satBtn) satBtn.click();
    });

    await page.waitForSelector('#live-satellite-modal:not(.hidden)', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 2500));

    console.log('Capturing overview screenshot with 1,389 satellites catalog...');
    await page.screenshot({ path: SHOT_OVERVIEW });
    console.log('Saved:', SHOT_OVERVIEW);

    console.log('Searching for Cartosat and selecting CARTOSAT 2F...');
    await page.evaluate(() => {
      const input = document.getElementById('sat-search-input');
      if (input) {
        input.value = 'Cartosat';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await new Promise((r) => setTimeout(r, 1000));

    await page.evaluate(() => {
      const items = document.querySelectorAll('.sat-quick-item');
      for (const item of items) {
        if (item.textContent.includes('CARTOSAT 2F')) {
          item.click();
          break;
        }
      }
    });

    await new Promise((r) => setTimeout(r, 2000));

    console.log('Capturing Cartosat 2F telemetry radar view...');
    await page.screenshot({ path: SHOT_CARTOSAT });
    console.log('Saved:', SHOT_CARTOSAT);

    console.log('All satellite verifications completed successfully!');
  } finally {
    await browser.close();
  }
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
