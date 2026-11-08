#!/usr/bin/env python3
"""
URBAN TRACKER & ROADGUARD AI — UNIFIED FULL-STACK MASTER RUNNER
Merges frontend 3D intelligence console, citizen login, road tracking,
and FastAPI backend into a single unified full-stack application.
"""

import os
import sys
import time
import socket
import signal
import subprocess
import urllib.request
import urllib.error
import json
import argparse

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "roadguard-ai", "backend")
LOGS_DIR = os.path.join(ROOT_DIR, "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

HTML_FILE = os.path.join(ROOT_DIR, "ACTIVE_ALL_LINKS.html")
TUNNEL_URL_FILE = os.path.join(LOGS_DIR, "active_tunnel_url.txt")

PORT_BACKEND = 8000
PORT_FRONTEND = 4173

# ANSI Colors
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

processes = []

def log(tag, msg, color=CYAN):
    print(f"{color}[{tag}]{RESET} {msg}")

def cleanup(sig=None, frame=None):
    print(f"\n{YELLOW}Shutting down all full-stack services...{RESET}")
    for p in processes:
        try:
            p.terminate()
            p.wait(timeout=2)
        except Exception:
            try:
                p.kill()
            except Exception:
                pass
    log("FULLSTACK", "All services cleanly stopped.", GREEN)
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def is_port_listening(port, host="127.0.0.1"):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.5)
            return s.connect_ex((host, port)) == 0
    except Exception:
        return False

def check_url(url, timeout=2.0):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "FullStackCheck/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as res:
            return res.getcode()
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return None

def find_untun_cli():
    candidate = "/Users/yaswanth/.npm/_npx/c628db61ff937621/node_modules/untun/dist/cli.mjs"
    if os.path.exists(candidate):
        return candidate
    return None

def build_frontend():
    log("BUILD", "Compiling frontend production bundle with Vite...", CYAN)
    try:
        res = subprocess.run(["npm", "run", "build"], cwd=ROOT_DIR, capture_output=True, text=True)
        if res.returncode == 0:
            log("BUILD", "Frontend bundle successfully compiled to dist/.", GREEN)
            return True
        else:
            log("BUILD", f"Vite build warning:\n{res.stderr}", YELLOW)
            return False
    except Exception as e:
        log("BUILD", f"Build failed: {e}", RED)
        return False

def main():
    parser = argparse.ArgumentParser(description="Urban Tracker Unified Full-Stack Runner")
    parser.add_argument("--mode", choices=["single", "dev"], default="single",
                        help="'single' merges all frontend and backend into FastAPI port 8000; 'dev' runs Vite on 4173 with proxy.")
    parser.add_argument("--no-build", action="store_true", help="Skip frontend build step")
    parser.add_argument("--no-tunnel", action="store_true", help="Skip public Cloudflare tunnel")
    parser.add_argument("--no-open", action="store_true", help="Do not open browser automatically")
    args = parser.parse_args()

    print(f"\n{BOLD}{CYAN}==================================================================={RESET}")
    print(f"{BOLD}{CYAN}     URBAN TRACKER & ROADGUARD AI — UNIFIED FULL STACK            {RESET}")
    print(f"{BOLD}{CYAN}==================================================================={RESET}\n")

    # 1. Build frontend if needed
    dist_index = os.path.join(ROOT_DIR, "dist", "index.html")
    if not args.no_build and (not os.path.exists(dist_index) or args.mode == "single"):
        build_frontend()

    # 2. Start Full-Stack Backend (serves 3D UI, citizen portal, tracker & APIs)
    backend_log = open(os.path.join(LOGS_DIR, "fullstack_backend.log"), "a")
    if not is_port_listening(PORT_BACKEND):
        log("BACKEND", f"Starting Unified Full-Stack FastAPI Server on port {PORT_BACKEND}...", CYAN)
        p_back = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", str(PORT_BACKEND), "--reload"],
            cwd=BACKEND_DIR,
            stdout=backend_log,
            stderr=subprocess.STDOUT
        )
        processes.append(p_back)
    else:
        log("BACKEND", f"Full-Stack FastAPI Server is already running on port {PORT_BACKEND}.", GREEN)

    # 3. Start Vite dev server if in dev mode
    target_tunnel_port = PORT_BACKEND
    if args.mode == "dev":
        target_tunnel_port = PORT_FRONTEND
        frontend_log = open(os.path.join(LOGS_DIR, "fullstack_frontend.log"), "a")
        if not is_port_listening(PORT_FRONTEND):
            log("FRONTEND", f"Starting Vite Dev Server on port {PORT_FRONTEND} with API proxy...", CYAN)
            p_front = subprocess.Popen(
                ["npx", "vite", "--port", str(PORT_FRONTEND), "--host"],
                cwd=ROOT_DIR,
                stdout=frontend_log,
                stderr=subprocess.STDOUT
            )
            processes.append(p_front)
        else:
            log("FRONTEND", f"Vite Dev Server is already running on port {PORT_FRONTEND}.", GREEN)

    # 4. Wait for services to be ready
    log("HEALTH", "Verifying service health...", CYAN)
    for _ in range(25):
        if is_port_listening(PORT_BACKEND):
            code = check_url(f"http://127.0.0.1:{PORT_BACKEND}/api/health")
            if code in (200, 307, 308):
                log("HEALTH", f"Unified Full-Stack server responsive [HTTP {code}].", GREEN)
                break
        time.sleep(0.5)

    # 5. Cloudflare Tunnel (Tunneling the Unified Full Stack)
    tunnel_url = None
    if os.path.exists(TUNNEL_URL_FILE):
        try:
            with open(TUNNEL_URL_FILE, "r") as f:
                tunnel_url = f.read().strip()
        except Exception:
            pass

    main_local_url = f"http://localhost:{target_tunnel_port}/"
    login_local_url = f"http://localhost:{target_tunnel_port}/login.html"
    track_local_url = f"http://localhost:{target_tunnel_port}/track.html"
    docs_local_url = f"http://localhost:{target_tunnel_port}/docs"
    health_local_url = f"http://localhost:{target_tunnel_port}/api/health"

    print(f"\n{BOLD}{GREEN}✔ FULL-STACK MERGED APPLICATION IS LIVE!{RESET}\n")
    print(f"{BOLD}Local Entrypoints (Port {target_tunnel_port}):{RESET}")
    print(f"  🔑  1. FIRST (Login Portal):         {CYAN}{login_local_url}{RESET}")
    print(f"  🌍  2. NEXT (RoadGuard AI Console):   {CYAN}{main_local_url}{RESET}")
    print(f"  📋  Track Road Complaints:           {CYAN}{track_local_url}{RESET}")
    print(f"  ⚡  FastAPI Swagger Docs:            {CYAN}{docs_local_url}{RESET}")
    print(f"  🩺  System Health Check:             {CYAN}{health_local_url}{RESET}\n")

    if tunnel_url:
        print(f"{BOLD}Public Global Access (First Login -> Then RoadGuard AI):{RESET}")
        print(f"  🔑  1. FIRST (Public Login Portal):      {CYAN}{tunnel_url}/login.html{RESET}")
        print(f"  🌍  2. NEXT (Public RoadGuard AI Console): {CYAN}{tunnel_url}/{RESET}")
        print(f"  🎯  Public Complaint Tracker:            {CYAN}{tunnel_url}/track.html{RESET}")
        print(f"  ⚡  Public API Docs:                     {CYAN}{tunnel_url}/docs{RESET}\n")

    # Open primary login URL in default browser
    if sys.platform == "darwin" and not args.no_open:
        try:
            subprocess.run(["open", login_local_url], check=False)
            log("LAUNCH", f"Opened {login_local_url} in your browser.", GREEN)
        except Exception:
            pass

    # If subprocesses were spawned, keep alive until Ctrl+C
    if processes:
        log("STATUS", "Full-stack runner active. Press Ctrl+C to stop all services.\n", BOLD)
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            cleanup()

if __name__ == "__main__":
    main()
