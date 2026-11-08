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
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: findChromeExecutable(),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.__godsEyeView?.viewer, { timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  // Dismiss modal
  await page.evaluate(() => {
    document.getElementById('first-run-launcher')?.remove();
  });

  console.log('--- TEST 1: Type in #header-search-input and press Enter ---');
  await page.evaluate(() => {
    const input = document.getElementById('header-search-input');
    input.value = 'Jaipur';
  });
  await page.type('#header-search-input', String.fromCharCode(13)); // Enter key
  await new Promise(r => setTimeout(r, 4000));

  console.log('--- TEST 2: Type in #header-search-input and click #header-search-btn ---');
  await page.evaluate(() => {
    const input = document.getElementById('header-search-input');
    input.value = 'Chennai';
    document.getElementById('header-search-btn').click();
  });
  await new Promise(r => setTimeout(r, 4000));

  console.log('--- TEST 3: Type in #location-search and click #location-search-btn ---');
  await page.evaluate(() => {
    const locBar = document.getElementById('location-bar');
    if (locBar) locBar.classList.remove('collapsed');
    const input = document.getElementById('location-search');
    input.value = 'Bengaluru';
    document.getElementById('location-search-btn').click();
  });
  await new Promise(r => setTimeout(r, 4000));

  console.log('--- TEST 4: Type an arbitrary city like "Guntur" or "Pune" in #header-search-input ---');
  await page.evaluate(() => {
    const input = document.getElementById('header-search-input');
    input.value = 'Pune';
    document.getElementById('header-search-btn').click();
  });
  await new Promise(r => setTimeout(r, 4000));

  await browser.close();
}

run().catch(console.error);
