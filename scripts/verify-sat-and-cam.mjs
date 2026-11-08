import fs from 'node:fs';
import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const SHOT_SAT = `${SHOT_DIR}/urban_tracker_live_satellite.png`;
const SHOT_CAM = `${SHOT_DIR}/urban_tracker_live_cams.png`;

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
  console.log('Launching browser to test LIVE SATELLITE & LIVE CAMS at', APP_URL);
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

  console.log('Waiting for loading screen to hide...');
  await page.waitForSelector('#loading-screen.hidden', { timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  // Dismiss welcome overlay if present
  try {
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 1000));
  } catch (e) { /* ignore */ }

  // 1. Test LIVE SATELLITE
  console.log('Opening LIVE SATELLITE modal...');
  const satOpened = await page.evaluate(() => {
    const btn = document.getElementById('header-live-sat-btn');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked header-live-sat-btn:', satOpened);
  await new Promise(r => setTimeout(r, 2000));

  const satState = await page.evaluate(() => {
    const modal = document.getElementById('live-satellite-modal');
    const isVisible = modal && !modal.classList.contains('hidden');
    const coords = document.getElementById('sat-telemetry-coords')?.textContent;
    const alt = document.getElementById('sat-telemetry-alt')?.textContent;
    const spd = document.getElementById('sat-telemetry-spd')?.textContent;
    const region = document.getElementById('sat-telemetry-region')?.textContent;
    const iframeSrc = document.getElementById('sat-live-video-iframe')?.src;
    return { isVisible, coords, alt, spd, region, iframeSrc };
  });
  console.log('Live Satellite State:', JSON.stringify(satState, null, 2));

  // Screenshot 1: LIVE SATELLITE
  await page.screenshot({ path: SHOT_SAT, fullPage: false });
  console.log('Saved screenshot:', SHOT_SAT);

  // Close satellite modal
  await page.evaluate(() => {
    document.getElementById('sat-modal-close-btn')?.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 2. Test LIVE CAMS
  console.log('Opening LIVE CAMS modal...');
  const camOpened = await page.evaluate(() => {
    const btn = document.getElementById('header-live-cctv-btn');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked header-live-cctv-btn:', camOpened);
  await new Promise(r => setTimeout(r, 2000));

  const camState = await page.evaluate(() => {
    const modal = document.getElementById('live-cctv-modal');
    const isVisible = modal && !modal.classList.contains('hidden');
    const title = document.getElementById('cctv-modal-cam-title')?.textContent;
    const city = document.getElementById('cctv-modal-cam-city')?.textContent;
    const status = document.getElementById('cctv-modal-cam-status')?.textContent;
    const itemsCount = document.querySelectorAll('.cctv-quick-item')?.length;
    return { isVisible, title, city, status, itemsCount };
  });
  console.log('Live Cams State:', JSON.stringify(camState, null, 2));

  // Screenshot 2: LIVE CAMS
  await page.screenshot({ path: SHOT_CAM, fullPage: false });
  console.log('Saved screenshot:', SHOT_CAM);

  await browser.close();
  console.log('Verification finished successfully.');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
