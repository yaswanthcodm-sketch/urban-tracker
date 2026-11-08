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

async function run() {
  const exe = findChromeExecutable();
  console.log('Using chrome exe:', exe);
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: exe,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__godsEyeView?.viewer, { timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    document.getElementById('first-run-launcher')?.remove();
  });

  const checkElements = await page.evaluate(() => {
    const hInput = document.getElementById('header-search-input');
    const hBtn = document.getElementById('header-search-btn');
    const lInput = document.getElementById('location-search');
    const lBtn = document.getElementById('location-search-btn');
    return {
      hasHeaderInput: !!hInput,
      hasHeaderBtn: !!hBtn,
      hasLocInput: !!lInput,
      hasLocBtn: !!lBtn,
      hInputValue: hInput?.value,
      lInputValue: lInput?.value,
    };
  });
  console.log('DOM Elements status:', checkElements);

  console.log('Testing header search button click with "Varanasi"...');
  const res = await page.evaluate(async () => {
    const input = document.getElementById('header-search-input');
    input.value = 'Varanasi';
    const btn = document.getElementById('header-search-btn');
    btn.click();
    return { clicked: true, inputValue: input.value };
  });
  console.log('Click result:', res);

  await new Promise(r => setTimeout(r, 4000));

  const camPos = await page.evaluate(() => {
    const gev = window.__godsEyeView;
    const cam = gev.viewer.camera;
    const carto = Cesium.Cartographic.fromCartesian(cam.position);
    return {
      lat: Cesium.Math.toDegrees(carto.latitude),
      lon: Cesium.Math.toDegrees(carto.longitude),
      height: carto.height,
      toast: document.getElementById('toast')?.textContent
    };
  });
  console.log('Camera position after header search:', camPos);

  await browser.close();
}

run().catch(console.error);
