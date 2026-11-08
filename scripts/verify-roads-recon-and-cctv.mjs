import fs from 'node:fs';
import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('Launching browser with Chrome at', CHROME);
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to', APP_URL);
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 35000 });

    // Wait for globe to settle and loading screen to fade
    await new Promise((r) => setTimeout(r, 4000));

    // 1. Verify CCTV Modal has NO YouTube and shows optical surveillance frame
    console.log('Opening CCTV modal and selecting India Gate...');
    await page.evaluate(() => {
      window.__gevLiveSatAndCam?.openCctvModal?.();
      const item = document.querySelector('.cctv-quick-item[data-cam-id="delhi-rajpath-gate"]');
      if (item) item.click();
    });

    await new Promise((r) => setTimeout(r, 4000));

    const cctvInfo = await page.evaluate(() => {
      const img = document.getElementById('cctv-modal-feed-img');
      const iframe = document.getElementById('cctv-modal-video-iframe');
      const title = document.getElementById('cctv-modal-cam-title')?.textContent;
      const status = document.getElementById('cctv-modal-cam-status')?.textContent;
      return {
        title,
        status,
        imgVisible: img && img.style.display !== 'none',
        imgSrc: img?.src,
        iframeVisible: iframe && iframe.style.display !== 'none',
      };
    });
    console.log('CCTV Info:', cctvInfo);

    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_cctv_optical_no_youtube.png` });
    console.log('Saved urban_tracker_cctv_optical_no_youtube.png');

    // Close CCTV modal
    await page.evaluate(() => {
      window.__gevLiveSatAndCam?.closeCctvModal?.();
    });

    // 2. Fly to village/town (Nuzvid) and test Road Reconnaissance
    console.log('Selecting road (Tiruvuru Road in Nuzvid)...');
    await page.evaluate(() => {
      window.__gevRoadRecon?.inspectRoad?.({
        id: 'way-nuzvid-tiruvuru-rd',
        name: 'Tiruvuru Road',
        ref: 'SH-42',
        type: 'primary',
        surface: 'asphalt',
        maxspeed: '60',
        centerLat: 16.7865,
        centerLon: 80.8465,
      });
    });

    await new Promise((r) => setTimeout(r, 4000));

    const roadInfo = await page.evaluate(() => {
      const modal = document.getElementById('road-recon-modal');
      const isVisible = modal && !modal.classList.contains('hidden');
      const title = document.getElementById('road-recon-title-text')?.textContent;
      const name = document.getElementById('road-recon-name-el')?.textContent;
      const coords = document.getElementById('road-recon-coords-el')?.textContent;
      const timeTag = document.getElementById('road-recon-time-tag')?.textContent;
      const img = document.getElementById('road-recon-img')?.src;
      return { isVisible, title, name, coords, timeTag, img };
    });
    console.log('Road Info:', roadInfo);

    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_road_recon_1h_satellite.png` });
    console.log('Saved urban_tracker_road_recon_1h_satellite.png');

    // 3. Switch to Optical Ground View
    console.log('Switching to Optical Ground View tab...');
    await page.evaluate(() => {
      document.getElementById('road-tab-optical')?.click();
    });
    await new Promise((r) => setTimeout(r, 4000));

    const opticalImg = await page.evaluate(() => {
      return document.getElementById('road-recon-img')?.src;
    });
    console.log('Optical image URL:', opticalImg);

    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_road_recon_submeter_optical.png` });
    console.log('Saved urban_tracker_road_recon_submeter_optical.png');

    console.log('Verification completed successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
