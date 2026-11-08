import fs from 'node:fs';
import puppeteer from 'puppeteer';

const CHROME_EXECUTABLE_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  process.env.PUPPETEER_EXECUTABLE_PATH,
].filter(Boolean);

function findChromeExecutable() {
  for (const candidate of CHROME_EXECUTABLE_CANDIDATES) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch { /* ignore */ }
  }
  return null;
}

async function testQuery(page, query, country = null) {
  console.log(`\n=== Testing query: "${query}" (Country: ${country || 'current'}) ===`);
  const res = await page.evaluate(async (q, c) => {
    const gev = window.__godsEyeView;
    const toastBefore = document.getElementById('toast')?.textContent;
    const hInput = document.getElementById('header-search-input');
    const hBtn = document.getElementById('header-search-btn');
    if (c) {
      const select = document.getElementById('header-country-select');
      if (select) {
        select.value = c;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    hInput.value = q;
    hBtn.click();
    return { q, c };
  }, query, country);

  // Wait 4s
  await new Promise(r => setTimeout(r, 4000));

  const status = await page.evaluate(() => {
    const gev = window.__godsEyeView;
    const cam = gev.viewer.camera;
    const carto = Cesium.Cartographic.fromCartesian(cam.position);
    return {
      lat: Cesium.Math.toDegrees(carto.latitude),
      lon: Cesium.Math.toDegrees(carto.longitude),
      height: carto.height,
      toast: document.getElementById('toast')?.textContent,
      locationMiniCity: document.getElementById('location-mini-city')?.textContent,
    };
  });
  console.log('Result:', status);
}

async function run() {
  const exe = findChromeExecutable();
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: exe,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[Search]') || text.includes('[LocationSearch]') || text.includes('Error')) {
      console.log('PAGE LOG:', text);
    }
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__godsEyeView?.viewer, { timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    document.getElementById('first-run-launcher')?.remove();
  });

  await testQuery(page, 'Guntur');
  await testQuery(page, 'Pune');
  await testQuery(page, 'Warangal');
  await testQuery(page, 'Tadepalligudem');
  await testQuery(page, 'Paris', 'france');
  await testQuery(page, 'London', 'uk');

  await browser.close();
}

run().catch(console.error);
