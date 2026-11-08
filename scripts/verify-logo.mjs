import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Capture loading screen with logo
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/urban_tracker_city_logo_loading.png' });
  console.log('Captured urban_tracker_city_logo_loading.png');

  // 2. Wait for app load
  await new Promise(r => setTimeout(r, 3000));
  const titleBar = await page.$('#title-bar');
  if (titleBar) {
    await titleBar.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/urban_tracker_titlebar_closeup.png' });
    console.log('Captured urban_tracker_titlebar_closeup.png');
  }
  const titleLogo = await page.$('#title-bar .title-logo');
  if (titleLogo) {
    await titleLogo.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/urban_tracker_city_logo_header_closeup.png' });
    console.log('Captured urban_tracker_city_logo_header_closeup.png');
  }

  // Also full page screenshot after a brief delay
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/urban_tracker_city_logo_full.png' });
  console.log('Captured urban_tracker_city_logo_full.png');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
