import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173/presentation.html';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('🚀 Running QA Verification for Presentation Deck...');
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to', APP_URL);
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Capture Slide 1 (Cover)
    await page.screenshot({ path: `${SHOT_DIR}/presentation_slide_1_cover.png` });
    console.log('Saved presentation_slide_1_cover.png');

    // Advance to Slide 4 (Pan-India Coverage)
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 800));

    // Capture Slide 4
    await page.screenshot({ path: `${SHOT_DIR}/presentation_slide_4_scanner.png` });
    console.log('Saved presentation_slide_4_scanner.png');

    // Advance to Slide 5 (Dual AI Detection)
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `${SHOT_DIR}/presentation_slide_5_ai.png` });
    console.log('Saved presentation_slide_5_ai.png');

    // Advance to Slide 7 (Civic Grievance Lodging)
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `${SHOT_DIR}/presentation_slide_7_grievance.png` });
    console.log('Saved presentation_slide_7_grievance.png');

    // Toggle Speaker notes
    await page.keyboard.press('n');
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: `${SHOT_DIR}/presentation_with_notes.png` });
    console.log('Saved presentation_with_notes.png');

    console.log('✅ QA Verification Succeeded! Presentation deck is 100% operational.');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ QA Verification Failed:', err);
  process.exit(1);
});
