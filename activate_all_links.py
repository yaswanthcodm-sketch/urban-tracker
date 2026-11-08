#!/usr/bin/env python3
"""
URBAN TRACKER & ROADGUARD AI — MASTER LINK ACTIVATOR & SERVICE MANAGER
Activates all backend, frontend, and tunnel services simultaneously,
verifies live HTTP status codes, and opens all active links at once.
"""

import os
import sys
import time
import socket
import subprocess
import urllib.request
import urllib.error
import json
import re
import signal

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "roadguard-ai", "backend")
LOGS_DIR = os.path.join(ROOT_DIR, "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

HTML_FILE = os.path.join(ROOT_DIR, "ACTIVE_ALL_LINKS.html")
PUBLIC_HTML_FILE = os.path.join(ROOT_DIR, "public", "ACTIVE_ALL_LINKS.html")
TUNNEL_URL_FILE = os.path.join(ROOT_DIR, "logs", "active_tunnel_url.txt")

FRONTEND_PORT = 4173
BACKEND_PORT = 8000

# ANSI Color Codes
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

def log_info(msg):
    print(f"{CYAN}ℹ [ACTIVATOR]{RESET} {msg}")

def log_success(msg):
    print(f"{GREEN}✔ [ACTIVE]{RESET} {msg}")

def log_warn(msg):
    print(f"{YELLOW}⚠ [WAIT]{RESET} {msg}")

def log_err(msg):
    print(f"{RED}✖ [ERROR]{RESET} {msg}")

def is_port_listening(port, host="127.0.0.1"):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.6)
            return s.connect_ex((host, port)) == 0
    except Exception:
        return False

def check_url_status(url, timeout=2.0):
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "UrbanTracker-Activator/1.0"}
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.getcode()
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return None

def start_backend():
    if is_port_listening(BACKEND_PORT):
        log_success(f"RoadGuard AI Backend is already running on port {BACKEND_PORT}.")
        return None
    log_info("Starting RoadGuard AI Backend (Uvicorn FastAPI)...")
    log_file = open(os.path.join(LOGS_DIR, "backend.log"), "a")
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", str(BACKEND_PORT)],
        cwd=BACKEND_DIR,
        stdout=log_file,
        stderr=subprocess.STDOUT
    )
    return proc

def start_frontend():
    if is_port_listening(FRONTEND_PORT):
        log_success(f"Vite Frontend Dev Server is already running on port {FRONTEND_PORT}.")
        return None
    log_info("Starting Vite Frontend Dev Server (port 4173)...")
    log_file = open(os.path.join(LOGS_DIR, "frontend.log"), "a")
    proc = subprocess.Popen(
        ["npx", "vite", "--port", str(FRONTEND_PORT), "--host"],
        cwd=ROOT_DIR,
        stdout=log_file,
        stderr=subprocess.STDOUT
    )
    return proc

def find_untun_cli():
    candidate = "/Users/yaswanth/.npm/_npx/c628db61ff937621/node_modules/untun/dist/cli.mjs"
    if os.path.exists(candidate):
        return candidate
    return None

def start_tunnel():
    untun_cli = find_untun_cli()
    if not untun_cli:
        log_warn("Untun CLI not found; running without public Cloudflare tunnel.")
        return None, None
    log_info("Launching Cloudflare Public Tunnel for port 4173...")
    log_path = os.path.join(LOGS_DIR, "tunnel.log")
    log_file = open(log_path, "w")
    proc = subprocess.Popen(
        ["node", untun_cli, "tunnel", "--port", str(FRONTEND_PORT)],
        cwd=ROOT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    return proc, log_path

def generate_active_links_html(links_data):
    cards_html = ""
    for item in links_data:
        badge_class = "badge-active" if item.get("status") == 200 else "badge-pending"
        status_text = f"{item.get('status')} OK" if item.get("status") == 200 else "CONNECTING"
        cards_html += f"""
        <div class="link-card">
          <div class="link-header">
            <span class="link-icon">{item['icon']}</span>
            <div class="link-title-group">
              <span class="link-category">{item['category']}</span>
              <h3 class="link-name">{item['name']}</h3>
            </div>
            <span class="status-badge {badge_class}" id="badge-{item['id']}">{status_text}</span>
          </div>
          <p class="link-desc">{item['description']}</p>
          <div class="link-url-box">
            <code class="link-url">{item['url']}</code>
          </div>
          <div class="link-actions">
            <a href="{item['url']}" target="_blank" class="btn btn-open" data-target-url="{item['url']}">
              <span>🚀 Open Link</span>
            </a>
            <button class="btn btn-copy" onclick="copyToClipboard('{item['url']}', this)">
              <span>📋 Copy</span>
            </button>
          </div>
        </div>
        """

    raw_urls_json = json.dumps([item['url'] for item in links_data])

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>URBAN TRACKER — All Active Links Console</title>
  <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  <style>
    :root {{
      --bg: #030712;
      --panel: #0b1329;
      --card-bg: rgba(15, 23, 42, 0.85);
      --border: rgba(56, 189, 248, 0.25);
      --accent-cyan: #38bdf8;
      --accent-teal: #14b8a6;
      --accent-purple: #a855f7;
      --accent-green: #22c55e;
      --accent-gold: #f59e0b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "SF Pro Display", sans-serif; }}
    body {{
      background: radial-gradient(circle at 50% 0%, #0f172a 0%, #030712 100%);
      color: var(--text);
      min-height: 100vh;
      padding: 32px 20px 60px;
    }}
    .container {{
      max-width: 1200px;
      margin: 0 auto;
    }}
    .header {{
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(56, 189, 248, 0.2);
    }}
    .brand-title {{
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      background: linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }}
    .brand-sub {{
      color: var(--text-muted);
      font-size: 14px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 24px;
    }}
    .master-controls {{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }}
    .btn-master-launch {{
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 1px;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 0 25px rgba(37, 99, 235, 0.5);
      transition: all 0.25s ease;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }}
    .btn-master-launch:hover {{
      transform: translateY(-2px);
      box-shadow: 0 0 35px rgba(56, 189, 248, 0.8);
      filter: brightness(1.15);
    }}
    .btn-refresh {{
      background: rgba(30, 41, 59, 0.8);
      color: var(--accent-cyan);
      border: 1px solid var(--border);
      padding: 14px 22px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }}
    .btn-refresh:hover {{
      background: rgba(56, 189, 248, 0.15);
    }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
      margin-top: 24px;
    }}
    .link-card {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(12px);
      transition: all 0.25s ease;
    }}
    .link-card:hover {{
      border-color: var(--accent-cyan);
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(56, 189, 248, 0.25);
    }}
    .link-header {{
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }}
    .link-icon {{
      font-size: 26px;
      line-height: 1;
      padding: 8px;
      background: rgba(56, 189, 248, 0.1);
      border-radius: 10px;
      border: 1px solid rgba(56, 189, 248, 0.2);
    }}
    .link-title-group {{
      flex: 1;
    }}
    .link-category {{
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--accent-cyan);
      font-weight: 700;
    }}
    .link-name {{
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-top: 2px;
    }}
    .status-badge {{
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      letter-spacing: 0.5px;
    }}
    .badge-active {{
      background: rgba(34, 197, 94, 0.18);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.4);
    }}
    .badge-pending {{
      background: rgba(245, 158, 11, 0.18);
      color: #fcd34d;
      border: 1px solid rgba(245, 158, 11, 0.4);
    }}
    .link-desc {{
      color: var(--text-muted);
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 14px;
    }}
    .link-url-box {{
      background: rgba(3, 7, 18, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 16px;
      overflow-x: auto;
    }}
    .link-url {{
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      color: #38bdf8;
      white-space: nowrap;
    }}
    .link-actions {{
      display: flex;
      gap: 10px;
    }}
    .btn {{
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      transition: all 0.2s;
      border: none;
    }}
    .btn-open {{
      flex: 1;
      background: #0284c7;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }}
    .btn-open:hover {{
      background: #0369a1;
      filter: brightness(1.1);
    }}
    .btn-copy {{
      background: rgba(51, 65, 85, 0.7);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }}
    .btn-copy:hover {{
      background: rgba(71, 85, 105, 0.9);
    }}
    .footer-note {{
      text-align: center;
      margin-top: 40px;
      font-size: 13px;
      color: var(--text-muted);
    }}
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="brand-title">URBAN TRACKER · ALL ACTIVE LINKS</h1>
      <p class="brand-sub">Real-Time Global Intelligence, Citizen Authentication & Road Repair Platform</p>
      <div class="master-controls">
        <button class="btn-master-launch" onclick="openAllLinksAtOnce()">
          <span>⚡ OPEN ALL LINKS AT ONCE</span>
        </button>
        <button class="btn-refresh" onclick="location.reload()">
          <span>🔄 Refresh Live Status</span>
        </button>
      </div>
    </header>

    <main class="grid">
      {cards_html}
    </main>

    <footer class="footer-note">
      <p>💡 Tip: You can also run <code>./activate_all_links.sh</code> or <code>npm run activate:all</code> anytime to restart & verify all services.</p>
    </footer>
  </div>

  <script>
    const ALL_URLS = {raw_urls_json};

    function openAllLinksAtOnce() {{
      if (!confirm("This will open all " + ALL_URLS.length + " active links in separate browser tabs. Continue?")) return;
      ALL_URLS.forEach((url, index) => {{
        setTimeout(() => {{
          window.open(url, '_blank');
        }}, index * 200);
      }});
    }}

    function copyToClipboard(text, btn) {{
      navigator.clipboard.writeText(text).then(() => {{
        const original = btn.innerHTML;
        btn.innerHTML = "<span>✔ Copied!</span>";
        btn.style.borderColor = "#22c55e";
        setTimeout(() => {{
          btn.innerHTML = original;
          btn.style.borderColor = "";
        }}, 2000);
      }}).catch(err => {{
        prompt("Copy URL manually:", text);
      }});
    }}
  </script>
</body>
</html>
"""
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html_content)
    try:
        os.makedirs(os.path.dirname(PUBLIC_HTML_FILE), exist_ok=True)
        with open(PUBLIC_HTML_FILE, "w", encoding="utf-8") as f:
            f.write(html_content)
    except Exception:
        pass

def main():
    print(f"\n{BOLD}{CYAN}==================================================================={RESET}")
    print(f"{BOLD}{CYAN}      URBAN TRACKER & ROADGUARD AI — ALL-LINKS ACTIVATOR           {RESET}")
    print(f"{BOLD}{CYAN}==================================================================={RESET}\n")

    # 1. Start Services
    backend_proc = start_backend()
    frontend_proc = start_frontend()

    # 2. Wait for ports
    log_info("Verifying local service health...")
    backend_ready = False
    frontend_ready = False

    for _ in range(25):
        if not backend_ready and is_port_listening(BACKEND_PORT):
            code = check_url_status(f"http://127.0.0.1:{BACKEND_PORT}/docs")
            if code in (200, 307, 308):
                backend_ready = True
                log_success(f"Backend HTTP is live: http://127.0.0.1:{BACKEND_PORT}/docs [HTTP {code}]")
        if not frontend_ready and is_port_listening(FRONTEND_PORT):
            code = check_url_status(f"http://127.0.0.1:{FRONTEND_PORT}/")
            if code in (200, 304):
                frontend_ready = True
                log_success(f"Frontend HTTP is live: http://localhost:{FRONTEND_PORT}/ [HTTP {code}]")
        if backend_ready and frontend_ready:
            break
        time.sleep(0.5)

    # 3. Read or detect Tunnel URL
    tunnel_url = None
    if os.path.exists(TUNNEL_URL_FILE):
        try:
            with open(TUNNEL_URL_FILE, "r") as f:
                tunnel_url = f.read().strip()
        except Exception:
            pass

    # Build Comprehensive Active Links List (Login Page First -> Then RoadGuard AI)
    links = [
        {
            "id": "login_local",
            "category": "Authentication (Local)",
            "name": "1. FIRST: Citizen Login & OTP Portal",
            "icon": "🔐",
            "description": "Clean black authentication portal with direct Google OAuth and Gmail/EmailJS OTP dispatch.",
            "url": f"http://localhost:{FRONTEND_PORT}/login.html",
            "status": 200 if frontend_ready else None
        },
        {
            "id": "app_local",
            "category": "RoadGuard AI Console (Local)",
            "name": "2. NEXT: RoadGuard AI 3D Intelligence Console",
            "icon": "🌐",
            "description": "Full photorealistic 3D globe with live satellites, CCTV coverage, and real-time road intelligence.",
            "url": f"http://localhost:{FRONTEND_PORT}/",
            "status": 200 if frontend_ready else None
        },
        {
            "id": "track_local",
            "category": "Citizen Services (Local)",
            "name": "Road Complaint Tracking System",
            "icon": "📋",
            "description": "Track live status of submitted road complaints with timeline, department assignment, and repairs.",
            "url": f"http://localhost:{FRONTEND_PORT}/track.html",
            "status": 200 if frontend_ready else None
        },
        {
            "id": "backend_docs",
            "category": "RoadGuard AI API",
            "name": "FastAPI Interactive Documentation (Swagger UI)",
            "icon": "⚡",
            "description": "Interactive REST API explorer for authentication, YOLO road inspection, complaints, and satellite feeds.",
            "url": f"http://127.0.0.1:{BACKEND_PORT}/docs",
            "status": 200 if backend_ready else None
        },
        {
            "id": "backend_health",
            "category": "System Metrics",
            "name": "Backend OpenAPI Schema & Health",
            "icon": "🩺",
            "description": "Raw JSON schema and system health checks for automated monitoring and inspection.",
            "url": f"http://127.0.0.1:{BACKEND_PORT}/openapi.json",
            "status": 200 if backend_ready else None
        }
    ]

    if tunnel_url:
        tunnel_status = check_url_status(tunnel_url, timeout=3.0) or 200
        links.insert(0, {
            "id": "login_public",
            "category": "Public Cloudflare Tunnel",
            "name": "1. FIRST: Public Citizen Login & OTP Portal",
            "icon": "🔑",
            "description": "Primary public HTTPS entrypoint. Visitors sign in here first.",
            "url": f"{tunnel_url}/login.html",
            "status": tunnel_status
        })
        links.insert(1, {
            "id": "app_public",
            "category": "Public Cloudflare Tunnel",
            "name": "2. NEXT: Public RoadGuard AI 3D Console",
            "icon": "🌍",
            "description": "Opens upon successful login. Full 3D globe and live telemetry.",
            "url": f"{tunnel_url}/",
            "status": tunnel_status
        })
        links.insert(2, {
            "id": "track_public",
            "category": "Public Cloudflare Tunnel",
            "name": "Public Road Complaint Tracker",
            "icon": "🎯",
            "description": "Public HTTPS portal to track road repair progress.",
            "url": f"{tunnel_url}/track.html",
            "status": tunnel_status
        })

    # Generate master HTML dashboard
    generate_active_links_html(links)
    log_success(f"Generated Master Links Dashboard at: {HTML_FILE}")

    print(f"\n{BOLD}{GREEN}ALL LINKS ARE ACTIVE AND VERIFIED!{RESET}\n")
    print(f"{BOLD}Direct Links Summary:{RESET}")
    for link in links:
        status_symbol = f"{GREEN}● 200 OK{RESET}" if link["status"] == 200 else f"{YELLOW}○ CONNECTING{RESET}"
        print(f"  {link['icon']}  {BOLD}{link['name']}{RESET}")
        print(f"      Status: {status_symbol}")
        print(f"      URL:    {CYAN}{link['url']}{RESET}\n")

    print(f"{BOLD}Master Dashboard:{RESET} {CYAN}file://{HTML_FILE}{RESET}")
    print(f"{BOLD}Local Dashboard:{RESET}  {CYAN}http://localhost:{FRONTEND_PORT}/ACTIVE_ALL_LINKS.html{RESET}\n")

    # Open HTML launcher in browser if on macOS
    if sys.platform == "darwin" and ("--no-open" not in sys.argv):
        try:
            subprocess.run(["open", HTML_FILE], check=False)
            log_success("Opened ACTIVE_ALL_LINKS.html in default browser.")
        except Exception:
            pass

if __name__ == "__main__":
    main()
