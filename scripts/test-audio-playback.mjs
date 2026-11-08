import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:4173';

async function testAudio() {
  console.log('Testing audio playback on inspect & raise problem...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    const txt = msg.text();
    if (txt.includes('play()') || txt.includes('Audio') || txt.includes('wav') || txt.includes('Voice') || txt.includes('Gemini') || txt.includes('road audio') || txt.includes('audio')) {
      console.log('[BROWSER AUDIO LOG]', msg.type(), txt);
    }
  });

  page.on('pageerror', err => console.error('[BROWSER ERROR]', err));

  // Spy on HTMLMediaElement.prototype.play
  await page.evaluateOnNewDocument(() => {
    window.__audioEvents = [];
    const origPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
      const src = this.src || this.currentSrc;
      if (src && src.includes('/audio/')) {
        console.log('🔊 Playing road audio clip:', src);
        window.__audioEvents.push({ event: 'play_called', src, time: Date.now() });
      }
      return origPlay.apply(this, arguments).then(res => {
        if (src && src.includes('/audio/')) {
          console.log('✅ Road audio play resolved successfully:', src);
          window.__audioEvents.push({ event: 'play_resolved', src, time: Date.now() });
        }
        return res;
      }).catch(err => {
        if (src && src.includes('/audio/')) {
          console.error('❌ Road audio play rejected:', err.name, err.message, src);
          window.__audioEvents.push({ event: 'play_rejected', src, error: err.name, time: Date.now() });
        }
        throw err;
      });
    };
  });

  await page.goto(`${BASE_URL}/?authenticated=true`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss intro modal
  try {
    await page.keyboard.press('Escape');
  } catch(e) {}
  await new Promise(r => setTimeout(r, 1000));

  // Switch to Telugu
  console.log('Selecting Telugu...');
  await page.select('#header-lang-select', 'te');
  await new Promise(r => setTimeout(r, 1500));

  // Search Nuzvid
  console.log('Searching Nuzvid...');
  await page.type('#header-search-input', 'nuzvid');
  await page.click('#header-search-btn');
  console.log('Waiting for Nuzvid roads to load in panel...');
  await page.waitForSelector('.road-inspect-btn', { timeout: 15000 });
  console.log('Road cards loaded!');

  // Click Inspect & Detect on first road
  console.log('\n--- CLICKING FIRST ROAD INSPECT BUTTON (.road-inspect-btn) ---');
  await page.click('.road-inspect-btn');
  await new Promise(r => setTimeout(r, 3000));

  let events = await page.evaluate(() => window.__audioEvents);
  console.log('\n--- AUDIO EVENTS AFTER INSPECT ---');
  console.log(JSON.stringify(events, null, 2));

  // Now click Raise the Problem on first road
  console.log('\n--- CLICKING RAISE THE PROBLEM BUTTON (.road-raise-problem-btn) ---');
  await page.click('.road-raise-problem-btn');
  await new Promise(r => setTimeout(r, 3000));

  events = await page.evaluate(() => window.__audioEvents);
  console.log('\n--- AUDIO EVENTS AFTER RAISE PROBLEM ---');
  console.log(JSON.stringify(events, null, 2));

  // Also test clicking Raise Problem on the floating card
  console.log('\n--- TESTING FLOATING CARD RAISE BUTTON (#road-condition-lodge-btn) ---');
  const floatingRaise = await page.$('#road-condition-lodge-btn');
  if (floatingRaise) {
    await floatingRaise.click();
    await new Promise(r => setTimeout(r, 2000));
    events = await page.evaluate(() => window.__audioEvents);
    console.log('\n--- AUDIO EVENTS AFTER FLOATING RAISE ---');
    console.log(JSON.stringify(events, null, 2));
  }

  await browser.close();
}

testAudio().catch(console.error);
