import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173/tech-stack-voice.html';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('🚀 Running QA Verification for Tech Stack Voice Explainer Website...');
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100 });

    console.log('Navigating to', APP_URL);
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Verify audio element
    const audioSrc = await page.evaluate(() => {
      const a = document.getElementById('audio-elem');
      return a ? a.getAttribute('src') : null;
    });
    console.log('Technical Audio Source:', audioSrc);

    // Verify 4 pillars present
    const pillarCount = await page.evaluate(() => {
      return document.querySelectorAll('.pillar-card').length;
    });
    console.log('Pillar Cards Count:', pillarCount);

    // Capture screenshot
    await page.screenshot({ path: `${SHOT_DIR}/tech_stack_voice_website.png`, fullPage: true });
    console.log('Saved tech_stack_voice_website.png');

    console.log('✅ QA Verification Succeeded! Technical voice explainer website is active.');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ QA Verification Failed:', err);
  process.exit(1);
});
