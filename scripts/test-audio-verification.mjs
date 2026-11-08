import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:4173';

(async () => {
  console.log('Testing audio playback on Inspect and Raise Problem...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    const txt = msg.text();
    if (txt.includes('🔊') || txt.includes('✅') || txt.includes('❌') || txt.includes('/audio/') || txt.includes('Voice') || txt.includes('Gemini') || txt.includes('Audio')) {
      console.log('[BROWSER AUDIO LOG]', msg.type(), txt);
    }
  });

  page.on('pageerror', err => console.error('[PAGE ERROR]', err));

  // Spy on HTMLMediaElement.prototype.play
  await page.evaluateOnNewDocument(() => {
    window.__playedAudios = [];
    const origPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
      const src = this.src || this.currentSrc;
      if (src && src.includes('/audio/')) {
        console.log('🔊 play() called on audio source:', src);
        window.__playedAudios.push({ src, status: 'called', time: Date.now() });
      }
      return origPlay.apply(this, arguments).then(res => {
        if (src && src.includes('/audio/')) {
          console.log('✅ play() resolved successfully on:', src);
          window.__playedAudios.push({ src, status: 'resolved', time: Date.now() });
        }
        return res;
      }).catch(err => {
        if (src && src.includes('/audio/')) {
          console.error('❌ play() rejected on:', src, 'Error:', err.name, err.message);
          window.__playedAudios.push({ src, status: 'rejected', error: err.name, time: Date.now() });
        }
        throw err;
      });
    };
  });

  await page.goto(`${BASE_URL}/?authenticated=true`, { waitUntil: 'networkidle2', timeout: 35000 });

  console.log('Waiting for window.__gevVillageRoadsCatalog to initialize...');
  await page.waitForFunction(() => !!window.__gevVillageRoadsCatalog, { timeout: 30000 });
  console.log('App initialized!');
  await new Promise(r => setTimeout(r, 1000));

  try { await page.keyboard.press('Escape'); } catch(e) {}
  await new Promise(r => setTimeout(r, 1000));

  // Switch to Telugu
  console.log('Switching to Telugu...');
  await page.select('#header-lang-select', 'te');
  await new Promise(r => setTimeout(r, 1000));

  // Open Roads Catalog for Nuzvid
  console.log('Opening village roads panel for Nuzvid...');
  await page.evaluate(() => {
    window.__gevVillageRoadsCatalog.openPanel('Nuzvid, Andhra Pradesh');
  });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Click Inspect Button
  console.log('\n--- 1. Clicking .road-inspect-btn ---');
  const inspectResult = await page.evaluate(() => {
    const btn = document.querySelector('.road-inspect-btn');
    if (btn) {
      btn.click();
      return { clicked: true, text: btn.textContent.trim() };
    }
    return { clicked: false };
  });
  console.log('Inspect button action:', inspectResult);
  await new Promise(r => setTimeout(r, 3000));

  let events = await page.evaluate(() => window.__playedAudios);
  console.log('Played audios after Inspect:');
  console.log(JSON.stringify(events, null, 2));

  // 2. Click Raise Problem Button
  console.log('\n--- 2. Clicking .road-raise-problem-btn ---');
  const raiseResult = await page.evaluate(() => {
    const btn = document.querySelector('.road-raise-problem-btn');
    if (btn) {
      btn.click();
      return { clicked: true, text: btn.textContent.trim() };
    }
    return { clicked: false };
  });
  console.log('Raise button action:', raiseResult);
  await new Promise(r => setTimeout(r, 3000));

  events = await page.evaluate(() => window.__playedAudios);
  console.log('Played audios after Raise Problem:');
  console.log(JSON.stringify(events, null, 2));

  await browser.close();
  console.log('\nFinished test successfully!');
})();
