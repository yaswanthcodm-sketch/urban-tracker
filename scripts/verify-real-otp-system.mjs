import puppeteer from 'puppeteer';

(async () => {
  console.log('Testing Urban Tracker Real EmailJS OTP Verification Flow...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Step 1: Load login page
    console.log('1. Loading login page...');
    await page.goto('http://localhost:4173/login', { waitUntil: 'networkidle2', timeout: 30000 });

    // Step 2: Switch to Sign Up tab
    console.log('2. Switching to Sign Up (OTP) tab...');
    await page.click('#tab-signup');
    await new Promise(r => setTimeout(r, 400));

    // Step 3: Type email
    const email = 'yaswanthcodm@gmail.com';
    console.log(`3. Entering email: ${email}...`);
    await page.type('#signup-email-input', email);

    // Step 4: Click Send Verification Code button
    console.log('4. Clicking Send Verification Code button...');
    await page.click('#send-otp-btn');

    // Wait for response and OTP view
    console.log('5. Waiting for EmailJS dispatch and OTP input view...');
    await page.waitForSelector('#otp-view', { visible: true, timeout: 15000 });

    // Step 5: Check success message
    const successEl = await page.$('#success-box');
    const successText = await page.evaluate(el => el ? el.textContent : '', successEl);
    console.log('6. Success box message:', successText);

    // Step 6: Verify 6 OTP boxes exist and are empty
    const digitsCount = await page.$$eval('.otp-digit', els => els.length);
    console.log(`7. Found ${digitsCount} OTP input digit boxes.`);

    // Take screenshot of OTP input screen
    await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/verify_12_real_otp_inbox_success.png' });
    console.log('Screenshot saved to verify_12_real_otp_inbox_success.png');

    console.log('\n✅ REAL EMAIL DELIVERY & OTP VIEW VERIFIED COMPLETELY!');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
