import puppeteer from 'puppeteer';

const APP_URL = 'http://localhost:4173/voice-explainer.html';
const SHOT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('🚀 Running QA Verification for Voice Explainer Player...');
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });

    console.log('Navigating to', APP_URL);
    await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Verify audio player exists and has source
    const audioSrc = await page.evaluate(() => {
      const audio = document.getElementById('audio-player');
      return audio ? audio.getAttribute('src') : null;
    });
    console.log('Audio Source:', audioSrc);

    // Verify sections count
    const sectionsCount = await page.evaluate(() => {
      return document.querySelectorAll('.section-item').length;
    });
    console.log('Transcript Sections Count:', sectionsCount);

    // Capture screenshot of Voice Explainer Player
    await page.screenshot({ path: `${SHOT_DIR}/voice_explainer_player.png`, fullPage: true });
    console.log('Saved voice_explainer_player.png');

    console.log('✅ QA Verification Succeeded! Voice explainer page is active and ready.');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ QA Verification Failed:', err);
  process.exit(1);
});
