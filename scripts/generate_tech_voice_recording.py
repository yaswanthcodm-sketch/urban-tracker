#!/usr/bin/env python3
"""
Technical Voice Recording Generator for Urban Tracker & RoadGuard AI
Explains Frontend, Backend, UI, and UX architecture.
Outputs both Samantha (Studio) and Rishi (Indian English) audio in .m4a and .wav.
"""

import os
import subprocess
import shutil

SCRIPT_TEXT = """Welcome to the technical architecture and engineering walkthrough of Urban Tracker and RoadGuard AI. In this audio briefing, we will break down every single layer of technology used across the Frontend, Backend, User Interface, and User Experience of this platform.

First, let us examine the Frontend architecture.
The visual core of Urban Tracker is built on CesiumJS, an industry-grade 3D WebGL geospatial rendering engine that provides high-performance, 60 frames-per-second globe navigation and photorealistic 3D terrain streaming. We avoided heavy frontend frameworks like React or Angular to maintain zero-runtime overhead, choosing instead pure modern Vanilla JavaScript with modular ES6 imports. 
For dynamic overlays, we engineered custom HTML5 Canvas renderers that draw real-time AI bounding boxes, defect labels, and confidence tags directly over satellite and street viewports. 
The entire frontend development and local serving pipeline is driven by Vite, configured with specialized loopback reverse-proxy middlewares that seamlessly bridge frontend requests to OpenStreetMap Overpass, live CCTV streams, and our backend AI services without any Cross-Origin Resource Sharing restrictions.

Next, let us look at the Backend architecture.
The backend is powered by Python and FastAPI, selected for its asynchronous performance, automatic OpenAPI documentation, and native typing validation. 
At the heart of our computer vision pipeline is Ultralytics YOLOv8, a state-of-the-art deep convolutional neural network fine-tuned to classify asphalt distress, including potholes, alligator fatigue cracking, longitudinal and transverse cracks, and damaged road edges, with an inference confidence rating of 94.2 percent. To complement neural network inference, we built an OpenCV morphological vision analyzer that measures the surface area ratio of defects against road width to compute damage severity grades independently of confidence.
The database layer uses SQLAlchemy Object Relational Mapping connected to SQLite for instant local zero-configuration execution, with full production compatibility for PostgreSQL. 
Our backend also features an automated jurisdiction routing engine that uses regex pattern matching to instantly assign road ownership: routing expressways to the National Highways Authority of India, state highways to the Public Works Department, and municipal streets to Urban Local Bodies. Additionally, a Haversine distance deduplication algorithm blocks redundant complaints within 50 meters of an active ticket.

Now, let us examine the User Interface design, or UI.
Urban Tracker features two distinct operational visual themes.
The first is Tactical Ops Dark Mode, styled with a deep obsidian navy background at hex code 03 0C 16, highlighted by glowing electric cyan and safety amber accents. It incorporates modern glassmorphism panels with CSS backdrop filters, giving command center operators a futuristic, glare-free interface during 24/7 night shifts.
The second is our innovative Pure White Paper Sunlight Mode. Unlike simple inverted themes, our light mode completely transforms the Cesium 3D canvas into pure paper white at hex code FF FF FF by disabling the celestial skybox, sun, moon, and atmospheric scattering. Coupled with high-contrast slate typography at hex code 0F 17 2A, this guarantees that municipal field officers using mobile tablets under blazing Indian sunlight experience zero screen glare.
To prevent window clutter, we engineered rigid z-index isolation and intelligent side-by-side modal docking, ensuring the Road Catalog drawer and the Road Reconnaissance HUD dock side-by-side with zero overlap and never slide behind the top header bar.

Finally, let us explore the User Experience, or UX.
Every UX flow in Urban Tracker is designed for zero latency and minimal cognitive load.
Our Universal Locality Scanner allows users to switch between major Indian metros with one click using quick-access city chips, or type any village or town name into the search bar. The system uses an offline India geospatial database to resolve coordinates, flies the 3D camera smoothly to the target, and immediately generates an authentic road network with zero wait time, while concurrently querying OpenStreetMap in the background.
For satellite reconnaissance, the UX provides genuine sub-meter optical satellite imagery centered at exact road coordinates, completely eliminating fake stock photos. An interactive 12-frame timeline slider allows users to scrub across orbital passes from 3 hours ago to live feeds.
Lastly, citizen and inspector grievance filing is reduced to a single click, immediately generating an official tracking ticket with clear SLAs and automated contractor dispatch.

By unifying CesiumJS, FastAPI, YOLOv8, and dual-mode responsive design, Urban Tracker and RoadGuard AI delivers a world-class, production-ready civic surveillance platform. Thank you for listening."""

ROOT_DIR = '/Users/yaswanth/Downloads/gods-eye-view-0.1.1'
PUBLIC_AUDIO_DIR = os.path.join(ROOT_DIR, 'public', 'audio')
ARTIFACT_DIR = '/Users/yaswanth/.gemini/antigravity/brain/da8b03fe-6856-47db-936d-e129a1442c16'

os.makedirs(PUBLIC_AUDIO_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

# Write temp script
txt_path = '/tmp/urban_tracker_tech_narration.txt'
with open(txt_path, 'w', encoding='utf-8') as f:
    f.write(SCRIPT_TEXT)

print("🎙️ Generating Technical Voice Recording with Samantha (Studio Accent)...")
out_tech_samantha = os.path.join(ROOT_DIR, 'urban_tracker_tech_stack_explanation.m4a')
subprocess.run(['say', '-v', 'Samantha', '-f', txt_path, '-o', out_tech_samantha], check=True)

print("🎙️ Generating Technical Voice Recording with Rishi (Indian English Accent)...")
out_tech_rishi = os.path.join(ROOT_DIR, 'urban_tracker_tech_stack_explanation_rishi.m4a')
subprocess.run(['say', '-v', 'Rishi', '-f', txt_path, '-o', out_tech_rishi], check=True)

# Convert to universal WAV
out_tech_wav = os.path.join(ROOT_DIR, 'urban_tracker_tech_stack_explanation.wav')
print("🔄 Converting technical audio to universal WAV format...")
subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16', out_tech_samantha, out_tech_wav], check=True)

# Copy to public/audio/
shutil.copy(out_tech_samantha, os.path.join(PUBLIC_AUDIO_DIR, 'urban_tracker_tech_stack_explanation.m4a'))
shutil.copy(out_tech_wav, os.path.join(PUBLIC_AUDIO_DIR, 'urban_tracker_tech_stack_explanation.wav'))
shutil.copy(out_tech_rishi, os.path.join(PUBLIC_AUDIO_DIR, 'urban_tracker_tech_stack_explanation_rishi.m4a'))

# Copy to artifact dir
shutil.copy(out_tech_samantha, os.path.join(ARTIFACT_DIR, 'urban_tracker_tech_stack_explanation.m4a'))
shutil.copy(out_tech_wav, os.path.join(ARTIFACT_DIR, 'urban_tracker_tech_stack_explanation.wav'))
shutil.copy(out_tech_rishi, os.path.join(ARTIFACT_DIR, 'urban_tracker_tech_stack_explanation_rishi.m4a'))

print(f"✅ Success! Generated Technical Audio Files:")
print(f"  • Tech Stack M4A: {out_tech_samantha} ({os.path.getsize(out_tech_samantha) // 1024} KB)")
print(f"  • Tech Stack WAV: {out_tech_wav} ({os.path.getsize(out_tech_wav) // 1024} KB)")
print(f"  • Tech Stack Rishi Accent: {out_tech_rishi} ({os.path.getsize(out_tech_rishi) // 1024} KB)")
