import puppeteer from 'puppeteer';

async function testVoicePopup() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  console.log('1. Navigating to http://127.0.0.1:4173/?guest=true ...');
  await page.goto('http://127.0.0.1:4173/?guest=true', { waitUntil: 'networkidle2' });

  // Wait 4 seconds for Cesium to settle
  await new Promise(r => setTimeout(r, 4000));

  console.log('2. Switching language to Telugu (te)...');
  await page.select('#header-lang-select', 'te');
  await new Promise(r => setTimeout(r, 1500));

  console.log('3. Opening Village & City Road Network drawer for Nuzvid...');
  await page.evaluate(() => {
    if (window.__gevVillageRoadsCatalog) {
      window.__gevVillageRoadsCatalog.openPanel('Nuzvid, Andhra Pradesh');
    } else {
      document.getElementById('header-roads-catalog-btn')?.click();
    }
  });
  await new Promise(r => setTimeout(r, 2000));

  console.log('4. Clicking "INSPECT & DETECT" button on damaged road...');
  const inspectClicked = await page.evaluate(() => {
    const btn = document.querySelector('.road-inspect-btn');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked inspect button:', inspectClicked);

  // Wait 2.5 seconds for floating card and voice banner
  await new Promise(r => setTimeout(r, 2500));

  const inspectState = await page.evaluate(() => {
    const banner = document.getElementById('road-condition-voice-banner');
    const text = document.getElementById('road-condition-voice-text');
    const card = document.getElementById('road-condition-floating-card');
    return {
      bannerVisible: banner ? window.getComputedStyle(banner).display !== 'none' : false,
      bannerText: text ? text.textContent : '',
      cardVisible: card ? window.getComputedStyle(card).display !== 'none' : false,
    };
  });
  console.log('Inspect Road Action State:', inspectState);
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/verified_inspect_voice_popup.png' });
  console.log('Saved verified_inspect_voice_popup.png');

  console.log('5. Clicking "🚨 RAISE THE PROBLEM" button...');
  const raiseClicked = await page.evaluate(() => {
    const btn = document.getElementById('road-condition-lodge-btn') || document.querySelector('.road-raise-problem-btn');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked raise the problem button:', raiseClicked);

  // Wait 2.5 seconds for 6-stage modal and problem raised announcement
  await new Promise(r => setTimeout(r, 2500));

  const raiseState = await page.evaluate(() => {
    const banner = document.getElementById('road-condition-voice-banner');
    const text = document.getElementById('road-condition-voice-text');
    const modal = document.getElementById('tracking-modal');
    return {
      bannerVisible: banner ? window.getComputedStyle(banner).display !== 'none' : false,
      bannerText: text ? text.textContent : '',
      modalVisible: modal ? !modal.classList.contains('hidden') : false,
    };
  });
  console.log('Raise Problem Action State:', raiseState);
  await page.screenshot({ path: '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/verified_raise_problem_voice_modal.png' });
  console.log('Saved verified_raise_problem_voice_modal.png');

  await browser.close();
}

testVoicePopup().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
