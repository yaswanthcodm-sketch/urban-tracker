#!/usr/bin/env bash
# ==============================================================================
# URBAN TRACKER & ROADGUARD AI — FULL-STACK MASTER LAUNCHER
# Single command to compile, launch, and manage the unified full stack.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

chmod +x "$SCRIPT_DIR/start_fullstack.py" 2>/dev/null || true

python3 "$SCRIPT_DIR/start_fullstack.py" "$@"
