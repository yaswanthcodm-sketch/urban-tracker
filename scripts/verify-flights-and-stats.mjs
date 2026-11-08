import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173';
const OUTPUT_SHOT = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/urban_tracker_flights_and_stats.png';

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
  console.log('Launching browser to verify URBAN TRACKER FLIGHTS & STATS at', APP_URL);
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

  console.log('Waiting for Cesium viewer and loading screen to hide...');
  await page.waitForSelector('#loading-screen.hidden', { timeout: 60000 });
  console.log('Loading screen hidden, waiting 3s for billboard rendering...');
  await new Promise(r => setTimeout(r, 4000));

  const stats = await page.evaluate(async () => {
    const statsEl = document.getElementById('header-intel-stats');
    const fltText = document.getElementById('stats-flights-count')?.textContent;
    const satsText = document.getElementById('stats-sats-count')?.textContent;
    const cctvText = document.getElementById('stats-cctv-count')?.textContent;
    const wxText = document.getElementById('stats-weather-count')?.textContent;
    const nucText = document.getElementById('stats-nuclear-count')?.textContent;
    const incText = document.getElementById('stats-incidents-count')?.textContent;
    const gevStats = window.__gevStats;

    // Check flight billboards
    const viewer = window.__godsEyeView?.viewer;
    let billboardCount = 0;
    if (viewer?.scene?.primitives) {
      for (let i = 0; i < viewer.scene.primitives.length; i++) {
        const prim = viewer.scene.primitives.get(i);
        if (prim && prim._billboards) {
          billboardCount += prim._billboards.length;
        }
      }
    }

    // Also fetch /api/stats
    let apiStats = null;
    try {
      const res = await fetch('/api/stats');
      apiStats = await res.json();
    } catch (e) {
      apiStats = { error: e.message };
    }

    return {
      hasStatsEl: !!statsEl,
      domCounts: {
        flights: fltText,
        sats: satsText,
        cctv: cctvText,
        weather: wxText,
        nuclear: nucText,
        incidents: incText,
      },
      gevStats,
      apiStats,
      billboardCount,
    };
  });

  console.log('Evaluation result:', JSON.stringify(stats, null, 2));

  // Dismiss first-run modal if present to reveal unobstructed globe
  try {
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 1200));
  } catch (e) {
    // ignore
  }

  // Take screenshot
  await page.screenshot({ path: OUTPUT_SHOT, fullPage: false });
  console.log('Screenshot saved to', OUTPUT_SHOT);

  await browser.close();
  console.log('Verification finished successfully.');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
