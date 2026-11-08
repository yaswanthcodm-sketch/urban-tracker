#!/usr/bin/env bash
# ==============================================================================
# URBAN TRACKER & ROADGUARD AI — ONE-COMMAND MASTER ACTIVATOR
# Activates all backend, frontend, and tunnel services at once,
# verifies all endpoints, and opens the master interactive dashboard.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

chmod +x "$SCRIPT_DIR/activate_all_links.py" 2>/dev/null || true

python3 "$SCRIPT_DIR/activate_all_links.py" "$@"
