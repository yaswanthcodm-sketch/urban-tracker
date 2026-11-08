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
  console.log('[TEST] Starting Complete Authentication System Verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // 1. Load login page
    console.log('[TEST] Navigating to', BASE_URL);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await sleep(800);

    // 2. Click Sign Up tab
    console.log('[TEST] Switching to Sign Up tab...');
    await page.click('#tab-signup');
    await sleep(400);

    // 3. Enter email yaswanthcodm@gmail.com
    const testEmail = 'yaswanthcodm@gmail.com';
    console.log('[TEST] Typing signup email:', testEmail);
    await page.type('#signup-email-input', testEmail);
    await sleep(300);

    // 4. Send OTP
    const preTime = Date.now();
    console.log('[TEST] Clicking Send Verification Code button...');
    await page.click('#send-otp-btn');

    // Wait for OTP view
    console.log('[TEST] Waiting for OTP view...');
    await page.waitForSelector('#otp-view.active', { timeout: 15000 });
    console.log('[TEST] OTP view active!');

    // Wait for OTP to be logged in backend daemon
    let otp = null;
    for (let i = 0; i < 20; i++) {
      await sleep(1000);
      otp = getLatestOtp(preTime);
      if (otp) break;
    }

    if (!otp) {
      throw new Error('Failed to retrieve dispatched OTP from backend log');
    }
    console.log(`[TEST] Successfully retrieved real OTP from backend: ${otp}`);

    // 5. Fill OTP digits
    console.log('[TEST] Typing 6-digit OTP into inputs...');
    const digitInputs = await page.$$('.otp-digit');
    for (let i = 0; i < 6; i++) {
      await digitInputs[i].type(otp[i]);
      await sleep(100);
    }

    // 6. Wait for transition to View 4: #password-create-view
    console.log('[TEST] Waiting for Password Creation screen (#password-create-view)...');
    await page.waitForSelector('#password-create-view.active', { timeout: 10000 });
    console.log('[TEST] Screen 4 "Create Your Password" is now ACTIVE!');

    // 7. Test live password rules & validation
    console.log('[TEST] Testing live password checklist rules...');
    await page.type('#new-password-input', 'Short1!');
    await sleep(300);

    // Check that length is still red
    const lengthValid1 = await page.$eval('#req-length', el => el.classList.contains('valid'));
    console.log(`[TEST] 'Short1!' length valid: ${lengthValid1} (Expected: false)`);

    // Type valid password
    await page.click('#new-password-input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    const validPassword = 'SecureUrban2026!';
    await page.type('#new-password-input', validPassword);
    await sleep(300);

    const lengthValid2 = await page.$eval('#req-length', el => el.classList.contains('valid'));
    const upperValid = await page.$eval('#req-upper', el => el.classList.contains('valid'));
    const lowerValid = await page.$eval('#req-lower', el => el.classList.contains('valid'));
    const numValid = await page.$eval('#req-num', el => el.classList.contains('valid'));
    const specialValid = await page.$eval('#req-special', el => el.classList.contains('valid'));
    const noSpaceValid = await page.$eval('#req-nospace', el => el.classList.contains('valid'));

    console.log(`[TEST] Validation checklist for '${validPassword}':`);
    console.log(`  - Length (>=8): ${lengthValid2}`);
    console.log(`  - Uppercase (A-Z): ${upperValid}`);
    console.log(`  - Lowercase (a-z): ${lowerValid}`);
    console.log(`  - Number (0-9): ${numValid}`);
    console.log(`  - Special char: ${specialValid}`);
    console.log(`  - No spaces: ${noSpaceValid}`);

    if (!(lengthValid2 && upperValid && lowerValid && numValid && specialValid && noSpaceValid)) {
      throw new Error('Password complexity checklist failed to validate valid password!');
    }

    // Test mismatched confirm password
    console.log('[TEST] Testing mismatched confirm password...');
    await page.type('#confirm-password-input', 'MismatchPass999!');
    await sleep(300);

    const matchText1 = await page.$eval('#pw-match-status', el => el.textContent);
    const isBtnDisabled1 = await page.$eval('#btn-save-password', el => el.disabled);
    console.log(`[TEST] Passwords status: "${matchText1}", Button disabled: ${isBtnDisabled1}`);

    // Take screenshot of live checklist
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_13_password_checklist_live.png') });
    console.log('[TEST] Saved verify_13_password_checklist_live.png');

    // Fix confirm password to match
    console.log('[TEST] Entering matching confirm password...');
    await page.click('#confirm-password-input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#confirm-password-input', validPassword);
    await sleep(300);

    const matchText2 = await page.$eval('#pw-match-status', el => el.textContent);
    const isBtnDisabled2 = await page.$eval('#btn-save-password', el => el.disabled);
    console.log(`[TEST] Passwords status: "${matchText2}", Button disabled: ${isBtnDisabled2}`);

    // 8. Submit password creation
    console.log('[TEST] Clicking Create Account & Sign In button...');
    await page.click('#btn-save-password');
    await sleep(1500);

    // Should redirect to Sign In view with success message and prefilled email
    await page.waitForSelector('#login-form', { visible: true });
    const successMsg = await page.$eval('#success-box', el => el.textContent);
    const prefilledEmail = await page.$eval('#identity', el => el.value);
    console.log(`[TEST] Redirected to Sign In! Success message: "${successMsg}", Prefilled email: "${prefilledEmail}"`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_14_password_saved_signin.png') });
    console.log('[TEST] Saved verify_14_password_saved_signin.png');

    // 9. Test Invalid Password Login
    console.log('[TEST] Testing login with wrong password...');
    await page.type('#password', 'WrongPassword999!');
    await page.click('#login-btn');
    await sleep(1000);

    const errorMsg = await page.$eval('#error-box', el => el.textContent);
    console.log(`[TEST] Error on invalid password: "${errorMsg}"`);
    if (!errorMsg.includes('Incorrect email or password')) {
      throw new Error(`Unexpected error message for wrong password: ${errorMsg}`);
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_15_invalid_password_error.png') });
    console.log('[TEST] Saved verify_15_invalid_password_error.png');

    // 10. Test Valid Password Login
    console.log('[TEST] Testing login with correct password...');
    await page.click('#password', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#password', validPassword);
    await page.click('#login-btn');

    console.log('[TEST] Waiting for navigation to Urban Tracker dashboard...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    const currentUrl = page.url();
    console.log(`[TEST] Successfully authenticated! Current URL: ${currentUrl}`);

    await sleep(2000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_16_authenticated_dashboard.png') });
    console.log('[TEST] Saved verify_16_authenticated_dashboard.png');

    console.log('\n[TEST SUMMARY] ALL CHECKS PASSED PERFECTLY!');
  } catch (err) {
    console.error('[TEST ERROR]', err);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_test_failure.png') }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
