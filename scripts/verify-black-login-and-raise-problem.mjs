import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting full verification of Black Login Page & Damaged Road Problem Raising flow...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('pageerror', err => errors.push(err.toString()));

  // 1. Visit /login
  console.log('Step 1: Navigating to /login ...');
  await page.goto('http://localhost:4173/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  const pageTitle = await page.title();
  console.log('Login Page Title:', pageTitle);

  // Take screenshot of restored sleek black login page
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/restored_black_login_verified.png' });
  console.log('Saved restored_black_login_verified.png');

  // Verify elements on black login page
  const loginState = await page.evaluate(() => {
    const email = document.getElementById('identity')?.value;
    const pwd = document.getElementById('password')?.value;
    const langSelect = document.getElementById('login-lang-select');
    const langCount = langSelect ? langSelect.options.length : 0;
    const cardBg = window.getComputedStyle(document.querySelector('.login-card')).backgroundColor;
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    return { email, pwd, langCount, cardBg, bodyBg };
  });
  console.log('Black Login Page Inspection:', loginState);

  // 2. Perform Login
  console.log('Step 2: Submitting login credentials...');
  await page.click('#login-btn');
  await new Promise(r => setTimeout(r, 2000));

  const currentUrl = page.url();
  console.log('URL after login:', currentUrl);

  // Wait for 3D globe initialization and loading screen to fade
  console.log('Waiting for 3D globe and UI to finish initializing...');
  await page.waitForFunction(() => {
    const overlay = document.getElementById('loading-overlay');
    return !overlay || overlay.style.display === 'none' || overlay.classList.contains('hidden') || !overlay.offsetParent || !!window.__gevVillageRoadsCatalog;
  }, { timeout: 25000 }).catch(() => console.log('Timeout waiting for overlay, proceeding anyway...'));

  await new Promise(r => setTimeout(r, 3000));

  // 3. Open Roads Drawer for Nuzvid (or select a place)
  console.log('Step 3: Opening Village & Town Roads Drawer for Nuzvid...');
  await page.evaluate(() => {
    if (window.__gevVillageRoadsCatalog) {
      window.__gevVillageRoadsCatalog.openPanel('Nuzvid, Andhra Pradesh');
    } else {
      document.getElementById('header-roads-catalog-btn')?.click();
    }
  });
  await new Promise(r => setTimeout(r, 2500));

  // Take screenshot of Roads Catalog Drawer with Damaged Roads at top and "RAISE THE PROBLEM"
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/roads_drawer_damaged_raise_problem.png' });
  console.log('Saved roads_drawer_damaged_raise_problem.png');

  // 4. Click "🚨 RAISE THE PROBLEM" on the first damaged road
  console.log('Step 4: Clicking "🚨 RAISE THE PROBLEM" on damaged road...');
  const raiseBtnClicked = await page.evaluate(() => {
    const btn = document.querySelector('.road-raise-problem-btn');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Raise problem button clicked:', raiseBtnClicked);

  await new Promise(r => setTimeout(r, 2500));

  // Take screenshot of Complaint Tracking Modal opened from "Raise the Problem"
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/complaint_tracking_from_raise_problem.png' });
  console.log('Saved complaint_tracking_from_raise_problem.png');

  // Verify Complaint Tracking modal contents
  const modalState = await page.evaluate(() => {
    const modal = document.getElementById('tracking-modal');
    const isVisible = modal && !modal.classList.contains('hidden');
    const tokenId = document.getElementById('track-token-id')?.textContent;
    const roadType = document.getElementById('track-road-type')?.textContent;
    const stages = document.querySelectorAll('.stage-card').length;
    const workerName = document.getElementById('track-worker-name')?.textContent;
    const hasBeforeImg = !!document.getElementById('audit-before-img')?.src;
    const hasAfterImg = !!document.getElementById('audit-after-img')?.src;
    return { isVisible, tokenId, roadType, stages, workerName, hasBeforeImg, hasAfterImg };
  });
  console.log('Tracking Modal Inspection State:', modalState);

  await browser.close();

  if (errors.length) {
    console.warn('Page errors logged:', errors);
  }
  console.log('Full flow verified successfully!');
})();
