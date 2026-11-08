const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Launching headless browser to verify Telugu full UI and speech synthesis...');
  const browser = await puppeteer.launch({
    headless: 'new',
    pipe: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();

  // Track speech synthesis invocations
  await page.evaluateOnNewDocument(() => {
    window.__spokenAnnouncements = [];
    if ('speechSynthesis' in window) {
      const origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
      window.speechSynthesis.speak = function(utterance) {
        window.__spokenAnnouncements.push({
          text: utterance.text,
          lang: utterance.lang,
          rate: utterance.rate,
          pitch: utterance.pitch,
          voice: utterance.voice ? utterance.voice.name : null
        });
        console.log('[Puppeteer SpeechSynthesis Intercepted]', utterance.text, 'lang:', utterance.lang);
        return origSpeak(utterance);
      };
    }
  });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('Navigating to http://localhost:4173/?guest=true...');
  await page.goto('http://localhost:4173/?guest=true', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait 2s for UI to stabilize
  await new Promise(r => setTimeout(r, 2000));

  // 1. Select Telugu
  console.log('Switching language dropdown to Telugu (te)...');
  await page.select('#header-lang-select', 'te');
  await page.evaluate(() => {
    const sel = document.getElementById('header-lang-select');
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await new Promise(r => setTimeout(r, 1000));

  // 2. Open All Roads Catalog Drawer
  console.log('Opening Village & City Roads Drawer...');
  await page.evaluate(() => {
    const btn = document.getElementById('header-roads-catalog-btn');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  // Check drawer title and pills
  const drawerInfo = await page.evaluate(() => {
    const title = document.querySelector('.village-roads-title')?.textContent;
    const switchLbl = document.querySelector('.selector-label')?.textContent;
    const pills = Array.from(document.querySelectorAll('.village-filter-pill')).map(p => p.textContent.trim());
    const cards = Array.from(document.querySelectorAll('.village-road-card')).map(c => ({
      name: c.querySelector('.road-card-name')?.textContent.trim(),
      condition: c.querySelector('.road-condition-pill')?.textContent.trim(),
      badge: c.querySelector('.road-card-badge')?.textContent.trim(),
      inspectBtn: c.querySelector('.road-inspect-btn')?.textContent.trim(),
      raiseBtn: c.querySelector('.road-raise-problem-btn')?.textContent.trim(),
    }));
    return { title, switchLbl, pills, cardsCount: cards.length, sampleCard: cards[0] };
  });

  console.log('Drawer Info in Telugu:', JSON.stringify(drawerInfo, null, 2));

  // 3. Click the first damaged road (Ward 14 CC Road)
  console.log('Clicking Inspect & Detect on first damaged road...');
  await page.evaluate(() => {
    const firstInspect = document.querySelector('.village-road-card .road-inspect-btn');
    if (firstInspect) firstInspect.click();
  });

  await new Promise(r => setTimeout(r, 1200));

  // Check Floating Road Inspector Card
  const floatingCardInfo = await page.evaluate(() => {
    const card = document.getElementById('road-condition-floating-card');
    const isVisible = card && !card.classList.contains('hidden');
    const statusPill = document.getElementById('road-condition-status-pill')?.textContent.trim();
    const voiceText = document.getElementById('road-condition-voice-text')?.textContent.trim();
    const name = document.getElementById('road-condition-name')?.textContent.trim();
    const defect = document.getElementById('road-condition-defect-desc')?.textContent.trim();
    const score = document.getElementById('road-condition-stat-score')?.textContent.trim();
    const dept = document.getElementById('road-condition-stat-authority')?.textContent.trim();
    const type = document.getElementById('road-condition-stat-type')?.textContent.trim();
    const surface = document.getElementById('road-condition-stat-surface')?.textContent.trim();
    const lodgeBtn = document.getElementById('road-condition-lodge-btn')?.textContent.trim();
    const reconBtn = document.getElementById('road-condition-recon-btn')?.textContent.trim();
    return { isVisible, statusPill, voiceText, name, defect, score, dept, type, surface, lodgeBtn, reconBtn };
  });

  console.log('Floating Card Info in Telugu:', JSON.stringify(floatingCardInfo, null, 2));

  // Check Spoken Announcements
  const spokenAnnouncements = await page.evaluate(() => window.__spokenAnnouncements);
  console.log('Spoken Announcements intercepted:', JSON.stringify(spokenAnnouncements, null, 2));

  // 4. Capture screenshot
  const screenshotPath = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/telugu_language_and_speech_verified.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  // 5. Click "Raise the problem" to test complaint raised audio & modal
  console.log('Clicking RAISE THE PROBLEM button...');
  await page.evaluate(() => {
    const btn = document.getElementById('road-condition-lodge-btn');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  const afterRaiseSpoken = await page.evaluate(() => window.__spokenAnnouncements);
  console.log('Spoken Announcements after raising problem:', JSON.stringify(afterRaiseSpoken, null, 2));

  const modalInfo = await page.evaluate(() => {
    const modal = document.getElementById('tracking-modal');
    const isVisible = modal && !modal.classList.contains('hidden');
    const title = document.getElementById('modal-track-title')?.textContent.trim();
    const statusPill = document.getElementById('track-status-pill')?.textContent.trim();
    return { isVisible, title, statusPill };
  });

  console.log('Tracking Modal after raising problem:', JSON.stringify(modalInfo, null, 2));

  const modalScreenshotPath = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16/telugu_tracking_modal_verified.png';
  await page.screenshot({ path: modalScreenshotPath });
  console.log('Modal screenshot saved to:', modalScreenshotPath);

  await browser.close();
  console.log('Verification finished successfully!');
})().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});
