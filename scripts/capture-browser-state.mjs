// scripts/capture-browser-state.mjs
import puppeteer from 'puppeteer';
import path from 'path';

process.on('unhandledRejection', (reason, p) => {
  console.log('Handled promise rejection:', reason);
});

const ARTIFACTS_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16';

async function main() {
  console.log('🚀 Launching headless browser to inspect http://localhost:4173/ ...');
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const consoleLogs = [];
    const pageErrors = [];

    page.on('console', (msg) => {
      const text = msg.text();
      const type = msg.type();
      consoleLogs.push({ type, text });
      if (type === 'error') {
        console.error(`[Browser Error]: ${text}`);
      }
    });

    page.on('pageerror', (err) => {
      console.error(`[Browser PageError]:`, err?.message || err);
      pageErrors.push(err?.message || String(err));
    });

    page.on('error', (err) => {
      console.error(`[Page Crash/Error]:`, err?.message || err);
    });

    console.log('Navigating to http://localhost:4173/ ...');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2', timeout: 25000 }).catch(e => {
      console.log('goto completed with note:', e.message);
    });
    
    await new Promise((r) => setTimeout(r, 4000));

    const shotPath1 = path.join(ARTIFACTS_DIR, 'browser_inspect_initial.png');
    await page.screenshot({ path: shotPath1 }).catch(e => console.error('Screenshot 1 error:', e));
    console.log(`Saved screenshot 1 to: ${shotPath1}`);

    console.log('Testing search for nuzvid...');
    const searchInput = await page.$('#header-search-input');
    const searchBtn = await page.$('#header-search-btn');

    if (searchInput && searchBtn) {
      await searchInput.type('nuzvid');
      await searchBtn.click();
      console.log('Clicked FIND button, waiting 5 seconds...');
      await new Promise((r) => setTimeout(r, 5000));

      const shotPath2 = path.join(ARTIFACTS_DIR, 'browser_inspect_nuzvid.png');
      await page.screenshot({ path: shotPath2 }).catch(e => console.error('Screenshot 2 error:', e));
      console.log(`Saved screenshot 2 to: ${shotPath2}`);
    } else {
      console.warn('Search input or button not found!');
    }

    console.log('\n--- BROWSER CONSOLE ERRORS & WARNINGS ---');
    const errors = consoleLogs.filter(l => l.type === 'error');
    console.log(`Total console errors: ${errors.length}`);
    errors.forEach((e, i) => console.log(`  ${i+1}. ${e.text}`));

    if (pageErrors.length > 0) {
      console.log('\n--- UNCAUGHT PAGE EXCEPTIONS ---');
      pageErrors.forEach((e, i) => console.log(`  ${i+1}. ${e}`));
    }
  } catch (err) {
    console.error('Fatal navigation/test error:', err);
  } finally {
    if (browser) await browser.close();
  }
}

main();
