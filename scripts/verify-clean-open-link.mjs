import puppeteer from 'puppeteer';

async function verify() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Navigating to root / ...');
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle2' });

  const currentUrl = page.url();
  console.log('Current URL after loading /:', currentUrl);

  // Take screenshot of starting page (should be black login screen)
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/verify_login_starting_page.png' });
  console.log('Saved verify_login_starting_page.png');

  // Check if we are on login page
  const hasLoginCard = await page.$('.login-card') !== null;
  console.log('Login card present:', hasLoginCard);

  // Click 3D Map Explorer guest link or submit
  const guestLink = await page.$('.direct-guest-btn');
  if (guestLink) {
    console.log('Clicking guest link...');
    await guestLink.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  }

  console.log('Current URL after entering:', page.url());
  await new Promise(r => setTimeout(r, 2000));

  // Check that clutter elements are hidden
  const hudHidden = await page.evaluate(() => {
    const hud = document.getElementById('intel-hud');
    const styleInd = document.getElementById('style-indicator');
    const globalStatus = document.getElementById('global-loading-status');
    const trafficChip = document.getElementById('traffic-sync-chip');
    return {
      hudVisible: hud ? window.getComputedStyle(hud).display !== 'none' : false,
      styleIndVisible: styleInd ? window.getComputedStyle(styleInd).display !== 'none' : false,
      globalStatusVisible: globalStatus ? window.getComputedStyle(globalStatus).display !== 'none' : false,
      trafficChipVisible: trafficChip ? window.getComputedStyle(trafficChip).display !== 'none' : false
    };
  });
  console.log('Clutter elements visibility check:', hudHidden);

  // Take screenshot of clean map
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/verify_clean_map_no_hud.png' });
  console.log('Saved verify_clean_map_no_hud.png');

  await browser.close();
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});
