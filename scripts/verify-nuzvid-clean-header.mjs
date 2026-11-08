import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';
const BASE_URL = 'http://127.0.0.1:4173';

async function run() {
  console.log('Testing Nuzvid view with Telugu language and verifying zero header clutter...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Load with authentication
  await page.goto(`${BASE_URL}/?authenticated=true`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss "Choose your first view" dialog if open
  try {
    await page.keyboard.press('Escape');
  } catch(e) {}
  await new Promise(r => setTimeout(r, 1000));

  // Change language to Telugu
  console.log('Selecting Telugu (te)...');
  await page.select('#header-lang-select', 'te');
  await new Promise(r => setTimeout(r, 1500));

  // Type Nuzvid in search
  console.log('Searching Nuzvid...');
  await page.type('#header-search-input', 'nuzvid');
  await page.click('#header-search-btn');
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verify_06_nuzvid_telugu_clean_header.png') });
  console.log('📸 Captured verify_06_nuzvid_telugu_clean_header.png');

  await browser.close();
  console.log('✅ Nuzvid Telugu clean test finished.');
}

run().catch(err => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
