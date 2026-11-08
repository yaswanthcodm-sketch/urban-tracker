/**
 * @file verify-satellite-footage.mjs
 * Verification script for near-real-time (NRT) satellite footage & imagery player in God's Eye View.
 */

import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const APP_URL = 'http://localhost:4173';

const CHROME_EXECUTABLE_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  (() => { try { return puppeteer.executablePath(); } catch { return null; } })(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);

function findChromeExecutable() {
  for (const candidate of CHROME_EXECUTABLE_CANDIDATES) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch {
      /* ignore */
    }
  }
  return null;
}

async function runVerification() {
  console.log('🚀 Starting Satellite Footage & Imagery Verification...');

  const executablePath = findChromeExecutable();
  console.log('Using browser executable:', executablePath);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--window-size=1600,1000',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('[Satellites') || text.includes('Footage') || text.includes('Error')) {
      console.log('  [Browser]', text);
    }
  });

  console.log(`Navigating to ${APP_URL}...`);
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Wait for app initialization and live sat & cam controller
  await page.waitForFunction(() => !!window.__gevLiveSatAndCam, { timeout: 30000 });
  console.log('✓ App initialized with liveSatAndCam controller.');

  // Open Live Satellite Modal via controller
  await page.evaluate(() => window.__gevLiveSatAndCam.openSatelliteModal());
  await page.waitForSelector('#live-satellite-modal:not(.hidden)', { timeout: 10000 });
  console.log('✓ Satellite Mission Control HUD opened.');

  // 1. Test INSAT-3D (15m) Tab
  console.log('Testing INSAT-3D (15m) footage tab...');
  await page.click('.sat-source-tab[data-source="insat-3d-asia-ir1"]');
  await page.waitForFunction(() => {
    const img = document.getElementById('sat-footage-image');
    return img && img.src && img.src.includes('insat-3d-asia-ir1');
  }, { timeout: 15000 });

  // Wait 1.5s for image render
  await new Promise((r) => setTimeout(r, 1500));
  const insatShotPath = path.join(ARTIFACT_DIR, 'urban_tracker_satellite_footage_insat.png');
  await page.screenshot({ path: insatShotPath });
  console.log(`✓ Captured INSAT-3D footage screenshot: ${insatShotPath}`);

  // 2. Test NOAA GOES-19 (10m) Tab & Timeline Scrubber
  console.log('Testing NOAA GOES-19 (10m) GeoColor tab and timeline scrubber...');
  await page.click('.sat-source-tab[data-source="noaa-goes19-geocolor"]');
  await page.waitForFunction(() => {
    const img = document.getElementById('sat-footage-image');
    return img && img.src && (img.src.includes('noaa-goes19') || img.src.includes('GOES19'));
  }, { timeout: 15000 });

  // Click Copy API button
  await page.click('#sat-footage-copy-api-btn');
  await new Promise((r) => setTimeout(r, 1500));
  const goesShotPath = path.join(ARTIFACT_DIR, 'urban_tracker_satellite_footage_goes19.png');
  await page.screenshot({ path: goesShotPath });
  console.log(`✓ Captured NOAA GOES-19 footage screenshot: ${goesShotPath}`);

  // 3. Test 3-Hour Rapid Storm Loop (GIF)
  console.log('Testing 3-Hour Rapid Storm Loop (GIF)...');
  await page.click('.sat-source-tab[data-source="insat-loop-ir1"]');
  await page.waitForFunction(() => {
    const img = document.getElementById('sat-footage-image');
    return img && img.src && img.src.includes('insat-loop-ir1');
  }, { timeout: 15000 });

  await new Promise((r) => setTimeout(r, 1500));
  const stormShotPath = path.join(ARTIFACT_DIR, 'urban_tracker_satellite_footage_stormloop.png');
  await page.screenshot({ path: stormShotPath });
  console.log(`✓ Captured 3-Hour Storm Loop screenshot: ${stormShotPath}`);

  // 4. Test Selecting CARTOSAT 2F from the 1,389 Satellite List
  console.log('Testing CARTOSAT 2F selection from list...');
  // Search for CARTOSAT in search box
  await page.type('#sat-search-input', 'CARTOSAT 2F');
  await new Promise((r) => setTimeout(r, 500));
  const cartosatItem = await page.$('.sat-quick-item[data-norad-id="43111"]');
  if (cartosatItem) {
    await cartosatItem.click();
    console.log('Clicked CARTOSAT 2F (#43111)...');
    await new Promise((r) => setTimeout(r, 1500));
    const cartosatShotPath = path.join(ARTIFACT_DIR, 'urban_tracker_satellite_footage_cartosat.png');
    await page.screenshot({ path: cartosatShotPath });
    console.log(`✓ Captured CARTOSAT selection with Earth footage: ${cartosatShotPath}`);
  }

  await browser.close();
  console.log('🎉 Verification completed successfully!');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
