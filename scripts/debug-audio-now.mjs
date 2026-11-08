import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:4173';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log(`[CONSOLE ${msg.type()}]`, msg.text()));
  page.on('pageerror', err => console.error('[PAGE ERROR]', err));

  console.log('Navigating to /?authenticated=true...');
  await page.goto(`${BASE_URL}/?authenticated=true`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 6000));

  console.log('Page URL:', page.url());
  const windowKeys = await page.evaluate(() => Object.keys(window).filter(k => k.startsWith('__gev')));
  console.log('GEV keys on window:', windowKeys);

  await browser.close();
})();
