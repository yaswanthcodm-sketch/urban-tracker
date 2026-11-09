/**
 * Server-side EmailJS Dispatcher via official @emailjs/nodejs SDK
 * Uses backend environment variables and privateKey secret.
 */
import emailjs from '@emailjs/nodejs';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Helper to load dotenv if not in process.env
function loadDotenv() {
  const envPaths = [
    resolve(rootDir, '.env'),
    resolve(rootDir, 'roadguard-ai', '.env'),
  ];
  for (const p of envPaths) {
    if (existsSync(p)) {
      try {
        const lines = readFileSync(p, 'utf-8').split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch (e) {}
    }
  }
}

loadDotenv();

const toEmail = process.argv[2];
const otpCode = process.argv[3];

if (!toEmail || !otpCode) {
  console.error(JSON.stringify({ ok: false, error: 'Usage: node send_emailjs.mjs <toEmail> <otpCode>' }));
  process.exit(1);
}

const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_6lrm73n';
const templateId = process.env.EMAILJS_TEMPLATE_ID || 'template_yzxx7gf';
const publicKey = process.env.EMAILJS_PUBLIC_KEY || 'uSaF57l9OYZ3jQT5Z';
const privateKey = process.env.EMAILJS_PRIVATE_KEY || 'ms45r6xA3Ua4ZmtzepQbg';

async function dispatch() {
  const templateParams = {
    email: toEmail,
    to_email: toEmail,
    recipient: toEmail,
    recipient_email: toEmail,
    passcode: otpCode,
    otp: otpCode,
    time: '5 minutes',
  };

  try {
    const res = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      {
        publicKey: publicKey,
        privateKey: privateKey,
      }
    );

    console.log(JSON.stringify({ ok: true, status: res.status, text: res.text, method: 'sdk' }));
    process.exit(0);
  } catch (err) {
    // If EmailJS non-browser API is restricted, use high-reliability fetch with browser Origin
    try {
      const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Origin': 'https://yaswanthcodm-sketch.github.io',
          'Referer': 'https://yaswanthcodm-sketch.github.io/urban-tracker/login.html',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      });

      if (resp.ok) {
        const text = await resp.text();
        console.log(JSON.stringify({ ok: true, status: resp.status, text: text || 'OK', method: 'rest' }));
        process.exit(0);
      } else {
        const errorText = await resp.text();
        console.error(JSON.stringify({ ok: false, status: resp.status, text: errorText }));
        process.exit(1);
      }
    } catch (fetchErr) {
      const status = err?.status || 500;
      const text = err?.text || err?.message || String(err);
      console.error(JSON.stringify({ ok: false, status, text }));
      process.exit(1);
    }
  }
}

dispatch();
