import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const ARTIFACT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';

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
  console.log('Launching browser with Chrome candidate...');
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
      '--window-size=1600,900',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900 });

    console.log('Navigating to http://localhost:4173 ...');
    await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!window.__godsEyeView?.viewer, { timeout: 60_000 });
    await new Promise((r) => setTimeout(r, 3000));

    // Completely remove first-run launcher modal so views are unobstructed
    await page.evaluate(() => {
      const launcher = document.getElementById('first-run-launcher');
      if (launcher) launcher.remove();
      const locBar = document.getElementById('location-bar');
      if (locBar) locBar.classList.remove('collapsed');
    });
    await new Promise((r) => setTimeout(r, 800));

    // Capture screenshot 1: 2-step hierarchy with India selected by default
    const shot1Path = path.resolve(ARTIFACT_DIR, 'urban_tracker_2step_country_india.png');
    await page.screenshot({ path: shot1Path });
    console.log(`Saved screenshot 1 to: ${shot1Path}`);

    // Switch country to USA
    console.log('Clicking USA country pill...');
    await page.evaluate(() => {
      const pill = Array.from(document.querySelectorAll('.country-pill')).find(p => p.dataset.country === 'usa' || p.dataset.countryId === 'usa');
      if (pill) pill.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    // Capture screenshot 2: USA country selected with USA towns/villages
    const shot2Path = path.resolve(ARTIFACT_DIR, 'urban_tracker_2step_country_usa.png');
    await page.screenshot({ path: shot2Path });
    console.log(`Saved screenshot 2 to: ${shot2Path}`);

    // Click back to India
    console.log('Clicking India country pill...');
    await page.evaluate(() => {
      const pill = Array.from(document.querySelectorAll('.country-pill')).find(p => p.dataset.country === 'india' || p.dataset.countryId === 'india');
      if (pill) pill.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Click village pill: Hampi
    console.log('Clicking Hampi village pill...');
    await page.evaluate(() => {
      const pill = document.querySelector('.location-village-pill[data-place-key="hampi"]');
      if (pill) pill.click();
    });

    // Wait for flight to complete
    console.log('Waiting for flight to Hampi to settle...');
    await new Promise((r) => setTimeout(r, 5000));

    // Capture screenshot 3: Hampi road-level view with 2-step navigation
    const shot3Path = path.resolve(ARTIFACT_DIR, 'urban_tracker_2step_village_hampi_roads.png');
    await page.screenshot({ path: shot3Path });
    console.log(`Saved screenshot 3 to: ${shot3Path}`);

    console.log('Verification completed successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('QA script error:', err);
  process.exit(1);
});
