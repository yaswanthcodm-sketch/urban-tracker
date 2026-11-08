import json
import subprocess
import os
import base64

API_KEY = os.getenv("GEMINI_API_KEY", "")
MODELS = ["gemini-3.8-flash-lite-tts", "gemini-3.1-flash-tts-preview", "gemini-3.8-flash-tts"]

CLIPS = {
    "te_road_damaged.wav": "హెచ్చరిక! రోడ్డు తీవ్రంగా దెబ్బతిన్నది. ప్రమాదకరమైన గుంతలు గుర్తించబడ్డాయి. దయచేసి సమస్యను నమోదు చేయండి.",
    "te_problem_raised.wav": "ఫిర్యాదు విజయవంతంగా నమోదైంది! అధికారిక టోకెన్ కేటాయించబడింది. మున్సిపల్ రోడ్డు మరమ్మతు బృందానికి పంపబడింది.",
    "te_road_good.wav": "ధృవీకరించబడింది! రోడ్డు చాలా మంచి స్థితిలో ఉంది. సురక్షితమైన ప్రయాణం.",
    "hi_road_damaged.wav": "चेतावनी! सड़क गंभीर रूप से क्षतिग्रस्त है। खतरनाक गड्ढे पाए गए हैं। कृपया समस्या दर्ज करें।",
    "hi_problem_raised.wav": "शिकायत सफलतापूर्वक दर्ज की गई! नगर निगम मरम्मत दल को सौंपा गया।",
    "en_road_damaged.wav": "Warning! Road damage detected. Severe potholes found. Please raise the problem.",
    "en_problem_raised.wav": "Official grievance registered successfully! Dispatched to municipal repair crew."
}

os.makedirs("public/audio", exist_ok=True)

def generate_clip(filename, text, voice="Kore"):
    out_path = os.path.join("public/audio", filename)
    print(f"Generating {filename}: {text[:30]}...")

    payload = {
        "contents": [{"parts": [{"text": text}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {
                        "voiceName": voice
                    }
                }
            }
        }
    }

    for model in MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
        cmd = [
            "curl", "-s", "-X", "POST", url,
            "-H", "Content-Type: application/json",
            "-d", json.dumps(payload)
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        try:
            data = json.loads(res.stdout)
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                for p in parts:
                    inline = p.get("inlineData", {})
                    if inline.get("data"):
                        audio_bytes = base64.b64decode(inline["data"])
                        with open(out_path, "wb") as f:
                            f.write(audio_bytes)
                        print(f"✓ Saved {filename} ({len(audio_bytes)} bytes) using {model}")
                        return True
            print(f"Model {model} failed: {data.get('error', {}).get('message', 'No parts')}")
        except Exception as e:
            print(f"Error parsing {model}: {e}")

    print(f"✗ Failed all models for {filename}")
    return False

for fn, text in CLIPS.items():
    generate_clip(fn, text)

print("Audio clip generation complete.")
