import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err));
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Open app and dismiss any modal if needed
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  console.log('Page loaded, waiting for globe arrival over India...');

  // Wait 4 seconds for flyToIndia animation to settle
  await new Promise(r => setTimeout(r, 4500));

  // Dismiss first run if visible
  await page.evaluate(() => {
    const firstRun = document.getElementById('first-run-launcher');
    if (firstRun) {
      firstRun.remove();
    }
    const settings = document.getElementById('provider-settings-modal');
    if (settings) {
      settings.removeAttribute('open');
      settings.style.display = 'none';
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/urban_tracker_auto_india.png' });
  console.log('Captured urban_tracker_auto_india.png');

  // 2. Search for a town/city: "Varanasi"
  console.log('Searching for "Varanasi"...');
  await page.evaluate(async () => {
    const input = document.getElementById('header-search-input');
    const btn = document.getElementById('header-search-btn');
    if (input && btn) {
      input.value = 'Varanasi';
      btn.click();
    }
  });

  // Wait 4.5 seconds for flight to arrive close
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/urban_tracker_city_roads_varanasi.png' });
  console.log('Captured urban_tracker_city_roads_varanasi.png');

  // 3. Search for a town/village: "Hampi"
  console.log('Searching for "Hampi"...');
  await page.evaluate(async () => {
    const input = document.getElementById('header-search-input');
    const btn = document.getElementById('header-search-btn');
    if (input && btn) {
      input.value = 'Hampi';
      btn.click();
    }
  });

  // Wait 4.5 seconds for flight to arrive close
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/urban_tracker_village_roads_hampi.png' });
  console.log('Captured urban_tracker_village_roads_hampi.png');

  await browser.close();
  console.log('All verification screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
