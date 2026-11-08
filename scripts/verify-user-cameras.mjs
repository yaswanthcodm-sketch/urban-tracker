import fs from 'node:fs';
import puppeteer from 'puppeteer';
import path from 'node:path';

const APP_URL = 'http://localhost:4173';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const SHOT_MIDEAST = `${SHOT_DIR}/urban_tracker_user_cameras_mideast.png`;
const SHOT_LONDON = `${SHOT_DIR}/urban_tracker_user_cameras_london.png`;

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
  console.log('Launching browser to test USER CAMERAS at', APP_URL);
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

    // Dismiss any overlays with Escape
    try {
      await page.keyboard.press('Escape');
      await new Promise((r) => setTimeout(r, 500));
    } catch { /* ignore */ }

    // Open Live Cams modal
    console.log('Opening Live CCTV modal...');
    const opened = await page.evaluate(() => {
      const btn = document.getElementById('header-live-cctv-btn');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('Clicked header-live-cctv-btn:', opened);
    await new Promise((r) => setTimeout(r, 1500));

    // 1. Select Middle East filter and view Israel Multi-Cam Live
    console.log('Selecting Middle East filter...');
    await page.evaluate(() => {
      const btn = document.querySelector('.cctv-filter-btn[data-filter="mideast"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Click Israel Multi-Cam
    console.log('Clicking Israel Multi-Cam...');
    await page.evaluate(() => {
      const item = document.querySelector('.cctv-quick-item[data-cam-id="il-israel-multicam"]');
      if (item) item.click();
    });
    await new Promise((r) => setTimeout(r, 2000));

    const mideastState = await page.evaluate(() => {
      const modal = document.getElementById('live-cctv-modal');
      const isVisible = modal && !modal.classList.contains('hidden');
      const camTitle = document.getElementById('cctv-modal-cam-title')?.textContent || '';
      const camCity = document.getElementById('cctv-modal-cam-city')?.textContent || '';
      const iframeSrc = document.getElementById('cctv-modal-video-iframe')?.src || '';
      const iframeDisplay = document.getElementById('cctv-modal-video-iframe')?.style.display || '';
      const listCount = document.querySelectorAll('.cctv-quick-item').length;
      return { isVisible, camTitle, camCity, iframeSrc, iframeDisplay, listCount };
    });
    console.log('Middle East State:', JSON.stringify(mideastState, null, 2));

    await page.screenshot({ path: SHOT_MIDEAST });
    console.log('Saved Middle East screenshot to:', SHOT_MIDEAST);

    // 2. Select London filter and search for Piccadilly
    console.log('Selecting London filter and searching for Piccadilly...');
    await page.evaluate(() => {
      const btn = document.querySelector('.cctv-filter-btn[data-filter="london"]');
      if (btn) btn.click();
      const input = document.getElementById('cctv-search-input');
      if (input) {
        input.value = 'Piccadilly';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Click Piccadilly Circus JamCam
    console.log('Clicking Piccadilly Circus...');
    await page.evaluate(() => {
      const item = document.querySelector('.cctv-quick-item[data-cam-id="tfl-JamCams_00001.07450"]');
      if (item) item.click();
    });
    await new Promise((r) => setTimeout(r, 2000));

    const londonState = await page.evaluate(() => {
      const modal = document.getElementById('live-cctv-modal');
      const isVisible = modal && !modal.classList.contains('hidden');
      const camTitle = document.getElementById('cctv-modal-cam-title')?.textContent || '';
      const camCity = document.getElementById('cctv-modal-cam-city')?.textContent || '';
      const imgSrc = document.getElementById('cctv-modal-feed-img')?.src || '';
      const listCount = document.querySelectorAll('.cctv-quick-item').length;
      return { isVisible, camTitle, camCity, imgSrc, listCount };
    });
    console.log('London State:', JSON.stringify(londonState, null, 2));

    await page.screenshot({ path: SHOT_LONDON });
    console.log('Saved London screenshot to:', SHOT_LONDON);

  } finally {
    await browser.close();
  }
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
