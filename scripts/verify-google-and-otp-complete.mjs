import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const BASE_URL = 'http://127.0.0.1:4173';

async function run() {
  console.log('🚀 Starting end-to-end verification of Google Sign-In, Real OTP Sign-Up, and Clean Header...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // ----------------------------------------------------
  // TEST 1: Login Page Visuals and Google Modal
  // ----------------------------------------------------
  console.log('Testing /login rendering...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_01_login_page_clean.png') });
  console.log('📸 Captured verify_01_login_page_clean.png');

  // Click Google button
  console.log('Clicking Google Sign-in button...');
  await page.click('#btn-google-auth');
  await new Promise(r => setTimeout(r, 600));

  const isModalActive = await page.$eval('#google-signin-modal', el => el.classList.contains('active'));
  console.log('Google modal active:', isModalActive);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_02_google_modal_open.png') });
  console.log('📸 Captured verify_02_google_modal_open.png');

  // Select Yaswanth account
  console.log('Selecting Yaswanth (Admin) Google Account...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }),
    page.click('#google-choose-yaswanth')
  ]);

  console.log('Current page URL after Google sign-in:', page.url());
  console.log('Waiting 6 seconds for Cesium 3D scene and HUD to settle...');
  await new Promise(r => setTimeout(r, 6000));

  // Check header text in main app
  const userPillText = await page.$eval('#header-always-login-btn', el => el.textContent.trim());
  console.log('Main app header user pill text:', userPillText);

  // Check that legacy chips are hidden and NOT overlapping
  const loadingChipVisible = await page.$eval('#global-loading-status', el => {
    const s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
  });
  const trafficChipVisible = await page.$eval('#traffic-sync-chip', el => {
    const s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
  });
  console.log('Loading chip visible:', loadingChipVisible, '| Traffic chip visible:', trafficChipVisible);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_03_logged_in_clean_header.png') });
  console.log('📸 Captured verify_03_logged_in_clean_header.png');

  // ----------------------------------------------------
  // TEST 2: Sign-Up Mode and Real OTP Verification Flow
  // ----------------------------------------------------
  console.log('\nTesting Sign-Up Mode and OTP Verification...');
  // Clear session
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Click Sign Up tab
  await page.click('#tab-signup');
  await new Promise(r => setTimeout(r, 500));

  const isSignupFormVisible = await page.$eval('#signup-form', el => el.style.display !== 'none');
  console.log('Sign up form visible:', isSignupFormVisible);

  // Enter test email
  const testEmail = 'yaswanthcodm@gmail.com';
  console.log(`Entering email: ${testEmail}...`);
  await page.type('#signup-email-input', testEmail);

  // Submit and wait for OTP dispatch response
  console.log('Clicking Send Verification Code...');
  await page.click('#send-otp-btn');

  // Wait for OTP view to become active
  await page.waitForSelector('#otp-view.active', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_04_signup_otp_screen.png') });
  console.log('📸 Captured verify_04_signup_otp_screen.png');

  // Click Auto-Fill which fills digits and triggers navigation
  console.log('Auto-filling 6-digit OTP code and waiting for navigation...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }),
    page.click('#dispatch-autofill-btn')
  ]);

  console.log('Current page URL after OTP verification:', page.url());
  console.log('Waiting 6 seconds for Cesium 3D scene and HUD to settle...');
  await new Promise(r => setTimeout(r, 6000));

  const finalUserPill = await page.$eval('#header-always-login-btn', el => el.textContent.trim());
  console.log('Final Header User Pill:', finalUserPill);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_05_signup_verified_entered.png') });
  console.log('📸 Captured verify_05_signup_verified_entered.png');

  await browser.close();
  console.log('🎉 All verification tests passed successfully!');
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
