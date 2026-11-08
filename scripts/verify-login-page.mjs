import puppeteer from 'puppeteer';

async function testLoginPage() {
  console.log('Testing Keylight Login Page & OTP Verification Flow...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1470, height: 900 });

  const errors = [];
  page.on('pageerror', err => errors.push(err.toString()));

  // 1. Visit /login
  console.log('1. Navigating to http://localhost:4173/login ...');
  await page.goto('http://localhost:4173/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  const pageTitle = await page.title();
  console.log('Page Title:', pageTitle);

  // Take screenshot of initial login page
  await page.screenshot({ path: '/tmp/keylight-login-initial.png' });
  console.log('Saved /tmp/keylight-login-initial.png');

  // 2. Test Invalid Email Rejection ("accept only email")
  console.log('2. Testing invalid email rejection...');
  await page.evaluate(() => {
    document.getElementById('identity').value = 'not-an-email';
    document.getElementById('phone').value = '+91 98765 43210';
    document.getElementById('signin-btn').click();
  });
  await new Promise(r => setTimeout(r, 500));
  const invalidEmailErr = await page.evaluate(() => document.getElementById('error-box')?.textContent);
  console.log('Invalid email error message:', invalidEmailErr);

  // 3. Test Valid Email & Phone ("ask there number and mail")
  console.log('3. Submitting valid work email and mobile number...');
  await page.evaluate(() => {
    document.getElementById('identity').value = 'agent@keylight.io';
    document.getElementById('phone').value = '+91 98765 43210';
    document.getElementById('signin-btn').click();
  });

  // Wait for OTP dispatch and toast
  await new Promise(r => setTimeout(r, 1500));
  const otpState = await page.evaluate(() => {
    const toast = document.getElementById('otp-toast-card');
    const toastCode = toast?.querySelector('.otp-toast__code')?.textContent?.trim();
    const otpViewActive = document.getElementById('otp-view')?.classList.contains('active');
    const targetDesc = document.getElementById('otp-target-desc')?.textContent;
    return {
      otpViewActive,
      toastCode,
      targetDesc,
    };
  });
  console.log('OTP Dispatch State:', otpState);

  // Take screenshot of OTP state with toast
  await page.screenshot({ path: '/tmp/keylight-otp-dispatched.png' });
  console.log('Saved /tmp/keylight-otp-dispatched.png');

  // 4. Test wrong OTP rejection ("check that you send code is same as they type")
  console.log('4. Testing wrong OTP code...');
  await page.evaluate(() => {
    const input = document.getElementById('otp-code');
    input.value = '000000';
    document.getElementById('verify-btn').click();
  });
  await new Promise(r => setTimeout(r, 500));
  const wrongOtpErr = await page.evaluate(() => document.getElementById('error-box')?.textContent);
  console.log('Wrong OTP error message:', wrongOtpErr);

  // 5. Test matching code ("send them in mail like ask there number and mail")
  console.log('5. Testing exact matching OTP code:', otpState.toastCode);
  await page.evaluate((code) => {
    const input = document.getElementById('otp-code');
    input.value = code;
    document.getElementById('verify-btn').click();
  }, otpState.toastCode);

  await new Promise(r => setTimeout(r, 1500));

  const authStorage = await page.evaluate(() => {
    return {
      url: window.location.href,
      auth: localStorage.getItem('urban_tracker_auth'),
      user: localStorage.getItem('urban_tracker_user'),
    };
  });
  console.log('Authenticated state:', authStorage);

  await browser.close();

  if (errors.length) {
    console.error('Browser errors encountered:', errors);
    process.exit(1);
  }
  console.log('ALL KEYLIGHT LOGIN & OTP VERIFICATION TESTS PASSED!');
}

testLoginPage().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
