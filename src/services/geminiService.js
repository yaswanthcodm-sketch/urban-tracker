/**
 * @module geminiService
 * @description Client-side Gemini AI integration for Deep Search & Geospatial Damage Analysis.
 */

const GEMINI_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.GEMINI_API_KEY) || '';
const GEMINI_DIRECT_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

/**
 * Performs deep geospatial or road intelligence search using Gemini AI.
 * First tries backend proxy (/api/roadguard/gemini/deep-search), then falls back to direct client API call.
 *
 * @param {string} query - The search query or question
 * @param {object} [options]
 * @param {string} [options.location] - Focus locality / city
 * @param {string} [options.language] - Language code (e.g. 'en', 'te', 'hi')
 * @param {object} [options.context] - Additional metadata context
 * @returns {Promise<{ success: boolean, result: string, model: string }>}
 */
export async function geminiDeepSearch(query, { location = 'India', language = 'en', context = {} } = {}) {
  if (!query || !query.trim()) {
    return { success: false, error: 'Empty query' };
  }

  // 1. Try backend API proxy
  try {
    const resp = await fetch('/api/roadguard/gemini/deep-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, location, language, context }),
    });

    if (resp.ok) {
      const data = await resp.json();
      return data;
    }
  } catch (backendErr) {
    console.warn('[GeminiService] Backend route unreachable, attempting direct API...', backendErr);
  }

  // 2. Direct Gemini API call fallback
  try {
    const prompt = `You are the RoadGuard AI & Urban Tracker Deep Search Engine.
Query: "${query}"
Location Context: "${location}"
Language: "${language}"

Provide a concise, highly accurate intelligence summary with exact road classifications, responsible municipal department, and safety analysis.`;

    const resp = await fetch(`${GEMINI_DIRECT_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 800 }
      })
    });

    if (resp.ok) {
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return {
        success: true,
        query,
        result: text.trim(),
        model: 'gemini-flash-latest'
      };
    }
    return { success: false, error: `Gemini API returned ${resp.status}` };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Analyzes road damage photos with Gemini Vision.
 *
 * @param {string} imageBase64 - Base64 encoded image string
 * @param {object} [options]
 * @param {string} [options.mimeType] - e.g. 'image/jpeg'
 * @param {string} [options.roadContext]
 * @returns {Promise<{ success: boolean, analysis: string }>}
 */
export async function geminiAnalyzeRoadDamage(imageBase64, { mimeType = 'image/jpeg', roadContext = '' } = {}) {
  try {
    const resp = await fetch('/api/roadguard/gemini/analyze-damage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: imageBase64, mime_type: mimeType, road_context: roadContext }),
    });

    if (resp.ok) {
      return await resp.json();
    }
  } catch (err) {
    console.warn('[GeminiService] Backend vision endpoint unreachable:', err);
  }

  return { success: false, error: 'Damage vision analysis requires backend connectivity.' };
}

let currentGeminiAudio = null;
let currentGeminiAudioPromise = null;
let currentGeminiAudioSrc = null;
const geminiAudioCache = new Map();

const PRE_GENERATED_CLIPS = {
  'te:road_damaged': '/audio/te_road_damaged.wav',
  'te:problem_raised': '/audio/te_problem_raised.wav',
  'te:road_good': '/audio/te_road_good.wav',
  'hi:road_damaged': '/audio/hi_road_damaged.wav',
  'hi:problem_raised': '/audio/hi_problem_raised.wav',
  'en:road_damaged': '/audio/en_road_damaged.wav',
  'en:problem_raised': '/audio/en_problem_raised.wav',
};

/**
 * Safely plays an HTMLAudioElement without AbortError interruption.
 * If the exact same audio is already actively playing, keeps playing.
 */
async function playAudioElement(audio, src) {
  // If the same audio is currently playing, let it finish uninterrupted
  if (currentGeminiAudio && currentGeminiAudioSrc === src && !currentGeminiAudio.paused && !currentGeminiAudio.ended) {
    return { success: true, audio: currentGeminiAudio, cached: true };
  }

  // Gracefully stop previous audio after its play promise has settled
  if (currentGeminiAudio) {
    const prev = currentGeminiAudio;
    const prevPromise = currentGeminiAudioPromise;
    currentGeminiAudio = null;
    currentGeminiAudioPromise = null;
    currentGeminiAudioSrc = null;

    try {
      if (prevPromise) {
        await prevPromise.catch(() => {});
      }
      prev.pause();
      prev.currentTime = 0;
    } catch {}
  }

  currentGeminiAudio = audio;
  currentGeminiAudioSrc = src;
  audio.volume = 1.0;
  audio.currentTime = 0;

  try {
    const playP = audio.play();
    currentGeminiAudioPromise = playP;
    if (playP !== undefined) {
      await playP;
    }
    return { success: true, audio };
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.warn('[GeminiTTS] Play notice:', err);
    }
    return { success: false, error: err.message };
  }
}

/**
 * Detects if text matches one of our pre-generated studio-quality Gemini voice files.
 */
function findPreGeneratedClip(text, lang) {
  const code = (lang || 'te').toLowerCase();
  const t = (text || '').toLowerCase();

  if (code === 'te') {
    if (t.includes('ఫిర్యాదు') || t.includes('నమోదైంది') || t.includes('టోకెన్')) return PRE_GENERATED_CLIPS['te:problem_raised'];
    if (t.includes('హెచ్చరిక') || t.includes('గుంతలు') || t.includes('దెబ్బతిన్నది')) return PRE_GENERATED_CLIPS['te:road_damaged'];
    if (t.includes('మంచి స్థితిలో') || t.includes('ధృవీకరించబడింది')) return PRE_GENERATED_CLIPS['te:road_good'];
  } else if (code === 'hi') {
    if (t.includes('शिकायत') || t.includes('दर्ज') || t.includes('टोकन')) return PRE_GENERATED_CLIPS['hi:problem_raised'];
    if (t.includes('चेतावनी') || t.includes('गड्ढे') || t.includes('क्षतिग्रस्त')) return PRE_GENERATED_CLIPS['hi:road_damaged'];
  } else {
    if (t.includes('grievance') || t.includes('registered') || t.includes('token')) return PRE_GENERATED_CLIPS['en:problem_raised'];
    if (t.includes('warning') || t.includes('damage') || t.includes('pothole')) return PRE_GENERATED_CLIPS['en:road_damaged'];
  }
  return null;
}

/**
 * Synthesizes realistic human-quality speech using Gemini TTS (Flash-Lite / 3.1 / 3.8).
 * Checks pre-generated clips first for 0ms delay, then tries backend proxy, then direct Gemini API.
 * Plays the returned audio/wav in the browser.
 *
 * @param {string} text - The text to speak (e.g. Telugu, Hindi, English road announcements)
 * @param {object} [options]
 * @param {string} [options.language] - Language code ('te', 'hi', 'en', etc.)
 * @param {string} [options.voice] - Prebuilt voice name ('Kore', 'Aoede', 'Puck', 'Charon')
 * @param {string} [options.clipKey] - Explicit clip key ('problem_raised', 'road_damaged')
 * @returns {Promise<{ success: boolean, audio?: HTMLAudioElement, cached?: boolean, model?: string }>}
 */
export async function geminiSpeakText(text, { language = 'te', voice = 'Kore', clipKey = null } = {}) {
  if (!text || !text.trim()) return { success: false, error: 'Empty text' };

  // 1. Instant Studio-Quality Clip (0ms Latency & No Quota Consumption)
  const explicitClip = clipKey ? PRE_GENERATED_CLIPS[`${language}:${clipKey}`] : null;
  const matchedClip = explicitClip || findPreGeneratedClip(text, language);
  if (matchedClip) {
    try {
      const fullUrl = (typeof window !== 'undefined' && matchedClip.startsWith('/'))
        ? window.location.origin + matchedClip
        : matchedClip;
      const audio = new Audio(fullUrl);
      const res = await playAudioElement(audio, fullUrl);
      if (res.success) {
        return { success: true, audio, model: 'gemini-studio-clip', cached: true };
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.warn('[GeminiTTS] Pre-generated clip error:', e);
      }
    }
  }

  const cacheKey = `${language}:${voice}:${text.trim()}`;
  if (geminiAudioCache.has(cacheKey)) {
    try {
      const cachedSrc = geminiAudioCache.get(cacheKey);
      const audio = new Audio(cachedSrc);
      const res = await playAudioElement(audio, cachedSrc);
      if (res.success) {
        return { success: true, audio, cached: true };
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.warn('[GeminiTTS] Cached audio error:', e);
    }
  }

  // 2. Try Backend Proxy (/api/roadguard/gemini/tts with multi-model failover)
  try {
    const resp = await fetch('/api/roadguard/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language, voice }),
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.audio_base64) {
        const audioSrc = `data:${data.mime_type || 'audio/wav'};base64,${data.audio_base64}`;
        geminiAudioCache.set(cacheKey, audioSrc);
        const audio = new Audio(audioSrc);
        const res = await playAudioElement(audio, audioSrc);
        if (res.success) {
          return { success: true, audio, model: data.model || 'gemini-3.8-flash-lite-tts' };
        }
      }
    }
  } catch (err) {
    console.warn('[GeminiTTS] Backend TTS unreachable, attempting direct Gemini API...', err);
  }

  // 3. Direct Gemini TTS Models (try flash-lite first, then 3.1, then 3.8)
  const models = ['gemini-3.8-flash-lite-tts', 'gemini-3.1-flash-tts-preview', 'gemini-3.8-flash-tts'];
  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice || 'Kore'
              }
            }
          }
        }
      };

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        const data = await resp.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        for (const p of parts) {
          if (p.inlineData?.data) {
            const audioSrc = `data:${p.inlineData.mimeType || 'audio/wav'};base64,${p.inlineData.data}`;
            geminiAudioCache.set(cacheKey, audioSrc);
            const audio = new Audio(audioSrc);
            const res = await playAudioElement(audio, audioSrc);
            if (res.success) {
              return { success: true, audio, model };
            }
          }
        }
      }
    } catch (directErr) {
      console.warn(`[GeminiTTS] Direct model ${model} error:`, directErr);
    }
  }

  // 4. Last resort: play fallback pre-generated language clip if available
  const emergencyClip = PRE_GENERATED_CLIPS[`${language}:road_damaged`] || PRE_GENERATED_CLIPS['en:road_damaged'];
  if (emergencyClip) {
    try {
      const audio = new Audio(emergencyClip);
      currentGeminiAudio = audio;
      await audio.play();
      return { success: true, audio, model: 'gemini-emergency-fallback' };
    } catch {}
  }

  return { success: false, error: 'Could not generate Gemini audio' };
}

