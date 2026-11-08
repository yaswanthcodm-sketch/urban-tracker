import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

const BACKEND_LOG_PATH = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/.system_generated/tasks/task-11911.log';
const ARTIFACT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const BASE_URL = 'http://localhost:4173/login';

function getLatestOtp(afterTimestamp) {
  if (!fs.existsSync(BACKEND_LOG_PATH)) return null;
  const content = fs.readFileSync(BACKEND_LOG_PATH, 'utf-8');
  const matches = [...content.matchAll(/\[AUTH OTP CODE\] >>> (\d{6}) <<</g)];
  if (matches.length === 0) return null;
  return matches[matches.length - 1][1];
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  console.log('[TEST] Starting Forgot Password Flow Verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // Wait for rate limit cooldown (30s) if needed
    console.log('[TEST] Cooldown 15s to bypass OTP rate limit...');
    await sleep(15000);

    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await sleep(500);

    // Click "Forgot password?"
    console.log('[TEST] Clicking "Forgot password?" link...');
    await page.click('#forgot-password-link');
    await sleep(400);

    const titleText = await page.$eval('#lbl-welcome', el => el.textContent);
    console.log(`[TEST] Active title: "${titleText}" (Expected: Reset Your Password)`);

    // Enter email
    const testEmail = 'yaswanthcodm@gmail.com';
    await page.click('#signup-email-input', { clickCount: 3 });
    await page.type('#signup-email-input', testEmail);
    await sleep(200);

    // Send reset OTP
    const preTime = Date.now();
    await page.click('#send-otp-btn');
    await page.waitForSelector('#otp-view.active', { timeout: 15000 });
    console.log('[TEST] Reset OTP dispatched! Waiting for code in backend log...');

    let otp = null;
    for (let i = 0; i < 20; i++) {
      await sleep(1000);
      otp = getLatestOtp(preTime);
      if (otp) break;
    }

    if (!otp) throw new Error('Could not retrieve reset OTP from log');
    console.log(`[TEST] Retrieved reset OTP: ${otp}`);

    // Type 6 digits
    const digitInputs = await page.$$('.otp-digit');
    for (let i = 0; i < 6; i++) {
      await digitInputs[i].type(otp[i]);
      await sleep(100);
    }

    // Wait for Reset Password screen
    await page.waitForSelector('#password-create-view.active', { timeout: 10000 });
    const pwScreenTitle = await page.$eval('#lbl-welcome', el => el.textContent);
    const saveBtnText = await page.$eval('#btn-save-password', el => el.textContent);
    console.log(`[TEST] Screen 4 Active! Title: "${pwScreenTitle}", Button: "${saveBtnText}"`);

    // Enter new password
    const newPassword = 'ResetSecret2026!';
    await page.type('#new-password-input', newPassword);
    await page.type('#confirm-password-input', newPassword);
    await sleep(300);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_17_forgot_password_flow.png') });
    console.log('[TEST] Saved verify_17_forgot_password_flow.png');

    await page.click('#btn-save-password');
    await sleep(1500);

    // Sign in with new password
    await page.waitForSelector('#login-form', { visible: true });
    await page.type('#password', newPassword);
    await page.click('#login-btn');

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log(`[TEST] Successfully reset password and signed in! URL: ${page.url()}`);
    console.log('\n[TEST SUMMARY] FORGOT PASSWORD FLOW PASSED PERFECTLY!');
  } catch (err) {
    console.error('[TEST ERROR]', err);
  } finally {
    await browser.close();
  }
})();
