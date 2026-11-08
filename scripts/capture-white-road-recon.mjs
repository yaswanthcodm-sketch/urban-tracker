import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('gev-first-run-session', 'dismissed');
      localStorage.setItem('gev-first-run-permanent', 'dismissed');
      localStorage.setItem('urban-tracker-theme', 'light');
    });

    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.waitForFunction(() => Boolean(window.__godsEyeView?.viewer), { timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    await page.evaluate(() => {
      document.getElementById('first-run-dialog')?.remove();
      document.querySelectorAll('.first-run-backdrop').forEach((el) => el.remove());
    });

    // Open Village Roads panel for Nuzvid
    await page.evaluate(() => {
      if (window.__gevVillageRoadsCatalog) {
        window.__gevVillageRoadsCatalog.scanRoadsForLocality({ name: 'Nuzvid, Andhra Pradesh' });
        window.__gevVillageRoadsCatalog.openPanel();
      }
    });

    await new Promise((r) => setTimeout(r, 1200));

    // Select the primary road to open Road Recon
    await page.evaluate(() => {
      const inspectBtn = document.querySelector('.road-inspect-btn');
      if (inspectBtn) inspectBtn.click();
    });

    await new Promise((r) => setTimeout(r, 2000));

    // Ensure light theme is cleanly applied across all elements
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.add('light-theme');
      if (window.__gevThemeController) {
        window.__gevThemeController.applyTheme('light');
      }
    });

    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `${SHOT_DIR}/urban_tracker_nuzvid_white_paper_mode.png` });
    console.log('✅ Captured urban_tracker_nuzvid_white_paper_mode.png');
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

run();
