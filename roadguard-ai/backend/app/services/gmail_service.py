"""
RoadGuard AI / Urban Tracker — Google Gmail API OAuth 2.0 Dispatcher
Directly sends OTP verification emails via the official Gmail REST API (users.messages.send).
Replaces third-party providers with direct Google Cloud infrastructure.
"""

import os
import re
import json
import time
import base64
import urllib.parse
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Optional, Dict, Any

import httpx

from ..config import settings

# In-memory access token cache
_TOKEN_CACHE: Dict[str, Any] = {
    "access_token": None,
    "expires_at": 0,
}

GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
GMAIL_SEND_ENDPOINT = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send"


def get_live_gmail_credentials() -> dict:
    """
    Reads the latest Google OAuth credentials dynamically from process.env,
    roadguard-ai/.env, and root .env without requiring a server reboot.
    """
    current_file = Path(__file__).resolve()
    # Path resolution: app/services/gmail_service.py -> backend -> roadguard-ai -> workspace
    backend_dir = current_file.parent.parent.parent
    workspace_dir = backend_dir.parent

    merged = {}
    for env_path in [workspace_dir / ".env", backend_dir / ".env"]:
        if env_path.exists():
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            merged[k.strip()] = v.strip().strip('"').strip("'")
            except Exception:
                pass

    merged.update(os.environ)

    client_id = (
        merged.get("GOOGLE_CLIENT_ID")
        or settings.GOOGLE_CLIENT_ID
        or "360174383437-h9a1861jct29n3bvsq0d0cv9l6va8dsk.apps.googleusercontent.com"
    ).strip()

    client_secret = (
        merged.get("GOOGLE_CLIENT_SECRET")
        or settings.GOOGLE_CLIENT_SECRET
        or ""
    ).strip()

    refresh_token = (
        merged.get("GOOGLE_REFRESH_TOKEN")
        or settings.GOOGLE_REFRESH_TOKEN
        or ""
    ).strip()

    sender_email = (
        merged.get("GMAIL_SENDER_EMAIL")
        or merged.get("SMTP_USER")
        or settings.GMAIL_SENDER_EMAIL
        or "oneh51522@gmail.com"
    ).strip()

    redirect_uri = (
        merged.get("GOOGLE_REDIRECT_URI")
        or settings.GOOGLE_REDIRECT_URI
        or "http://localhost:8000/api/auth/google/callback"
    ).strip()

    return {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "sender_email": sender_email,
        "redirect_uri": redirect_uri,
    }


def save_refresh_token_to_env(refresh_token: str, sender_email: Optional[str] = None):
    """
    Persists an obtained refresh token into .env files securely.
    """
    current_file = Path(__file__).resolve()
    backend_dir = current_file.parent.parent.parent
    workspace_dir = backend_dir.parent

    target_files = [workspace_dir / ".env", backend_dir / ".env"]
    for path in target_files:
        lines = []
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                lines = f.readlines()

        has_rt = False
        has_sender = False
        new_lines = []
        for line in lines:
            if line.startswith("GOOGLE_REFRESH_TOKEN="):
                new_lines.append(f'GOOGLE_REFRESH_TOKEN="{refresh_token}"\n')
                has_rt = True
            elif sender_email and line.startswith("GMAIL_SENDER_EMAIL="):
                new_lines.append(f'GMAIL_SENDER_EMAIL="{sender_email}"\n')
                has_sender = True
            else:
                new_lines.append(line)

        if not has_rt:
            new_lines.append(f'GOOGLE_REFRESH_TOKEN="{refresh_token}"\n')
        if sender_email and not has_sender:
            new_lines.append(f'GMAIL_SENDER_EMAIL="{sender_email}"\n')

        try:
            with open(path, "w", encoding="utf-8") as f:
                f.writelines(new_lines)
        except Exception as e:
            print(f"[AUTH GMAIL NOTICE] Could not write to {path}: {e}")

    # Update in-memory settings
    settings.GOOGLE_REFRESH_TOKEN = refresh_token
    if sender_email:
        settings.GMAIL_SENDER_EMAIL = sender_email
    os.environ["GOOGLE_REFRESH_TOKEN"] = refresh_token


def get_oauth_authorization_url(redirect_uri: Optional[str] = None) -> str:
    """
    Generates the Google OAuth 2.0 consent URL for Gmail sending.
    """
    creds = get_live_gmail_credentials()
    target_redirect = redirect_uri or creds["redirect_uri"]

    params = {
        "client_id": creds["client_id"],
        "redirect_uri": target_redirect,
        "response_type": "code",
        "scope": GMAIL_SEND_SCOPE,
        "access_type": "offline",
        "prompt": "consent",
    }
    return f"{GOOGLE_AUTH_URL}?{urllib.parse.urlencode(params)}"


def exchange_code_for_tokens(code: str, redirect_uri: Optional[str] = None) -> dict:
    """
    Exchanges an authorization code returned from Google for an access token
    and a permanent refresh token.
    """
    creds = get_live_gmail_credentials()
    target_redirect = redirect_uri or creds["redirect_uri"]

    if not creds["client_secret"]:
        return {
            "ok": False,
            "error": "MISSING_CLIENT_SECRET",
            "message": "GOOGLE_CLIENT_SECRET is missing. Please configure it in .env before completing OAuth."
        }

    payload = {
        "client_id": creds["client_id"],
        "client_secret": creds["client_secret"],
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": target_redirect,
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(GOOGLE_TOKEN_ENDPOINT, data=payload)
            data = resp.json()

            if resp.status_code == 200:
                refresh_token = data.get("refresh_token")
                access_token = data.get("access_token")
                expires_in = data.get("expires_in", 3600)

                if refresh_token:
                    save_refresh_token_to_env(refresh_token)

                _TOKEN_CACHE["access_token"] = access_token
                _TOKEN_CACHE["expires_at"] = time.time() + expires_in - 60

                return {
                    "ok": True,
                    "refresh_token_saved": bool(refresh_token),
                    "expires_in": expires_in,
                    "message": "Gmail API OAuth tokens successfully generated and saved!"
                }
            else:
                error_desc = data.get("error_description") or data.get("error") or resp.text
                return {
                    "ok": False,
                    "status_code": resp.status_code,
                    "error": "OAUTH_EXCHANGE_FAILED",
                    "message": f"Google OAuth exchange failed ({resp.status_code}): {error_desc}"
                }
    except Exception as e:
        return {
            "ok": False,
            "error": "NETWORK_ERROR",
            "message": f"Could not reach Google OAuth server: {str(e)}"
        }


def get_valid_access_token() -> Optional[str]:
    """
    Returns an active, unexpired Google OAuth access token.
    Refreshes automatically via the permanent refresh token if expired.
    """
    now = time.time()
    if _TOKEN_CACHE.get("access_token") and now < _TOKEN_CACHE.get("expires_at", 0):
        return _TOKEN_CACHE["access_token"]

    creds = get_live_gmail_credentials()
    refresh_token = creds["refresh_token"]
    client_id = creds["client_id"]
    client_secret = creds["client_secret"]

    if not (refresh_token and client_id and client_secret):
        return None

    payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(GOOGLE_TOKEN_ENDPOINT, data=payload)
            if resp.status_code == 200:
                data = resp.json()
                access_token = data["access_token"]
                expires_in = data.get("expires_in", 3600)
                _TOKEN_CACHE["access_token"] = access_token
                _TOKEN_CACHE["expires_at"] = now + expires_in - 60
                return access_token
            else:
                err_data = resp.json() if "application/json" in resp.headers.get("content-type", "") else {}
                err_desc = err_data.get("error_description") or err_data.get("error") or resp.text
                print(f"[AUTH GMAIL API ERROR] Failed refreshing access token ({resp.status_code}): {err_desc}")
                return None
    except Exception as e:
        print(f"[AUTH GMAIL API ERROR] Network error refreshing token: {e}")
        return None


def send_gmail_otp(to_email: str, otp_code: str) -> dict:
    """
    Sends an OTP verification email to the user via the official Gmail REST API.
    Recipient is strictly the to_email parameter entered by the user.
    """
    clean_recipient = (to_email or "").strip().lower()

    # Format validation
    email_regex = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    if not re.match(email_regex, clean_recipient):
        return {
            "delivered": False,
            "status": "INVALID_EMAIL",
            "provider": "Gmail-API",
            "recipient": clean_recipient,
            "message": "The recipient email address is invalid."
        }

    creds = get_live_gmail_credentials()
    sender_email = creds["sender_email"]

    access_token = get_valid_access_token()
    if not access_token:
        # Check specific reason for missing token
        if not creds["client_secret"]:
            reason = "MISSING_CLIENT_SECRET"
            msg = "Gmail API Client Secret is missing in .env."
        elif not creds["refresh_token"]:
            reason = "MISSING_REFRESH_TOKEN"
            msg = "Gmail API Refresh Token is missing. Please authorize via /api/auth/google/authorize or OAuth Playground."
        else:
            reason = "TOKEN_REFRESH_FAILED"
            msg = "Failed to refresh Google OAuth access token. Please verify Client ID and Secret."

        return {
            "delivered": False,
            "status": "AUTH_ERROR",
            "reason": reason,
            "provider": "Gmail-API",
            "recipient": clean_recipient,
            "message": msg
        }

    # Construct RFC 2822 MIME Email
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Urban Tracker – Email Verification Code"
    msg["From"] = f"Urban Tracker Security <{sender_email}>" if "@" in sender_email else f"{sender_email} <me>"
    msg["To"] = clean_recipient

    plain_text = f"""Hello,

Your Urban Tracker verification code is: {otp_code}

This code expires in 5 minutes.

If you did not request this code, you can ignore this email.

Regards,
Urban Tracker Team
"""

    html_text = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background-color:#080b18;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:540px;margin:0 auto;background:#10172e;border:1px solid #1e293b;border-radius:12px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.5);">
    <tr>
      <td style="padding:28px 32px 18px;text-align:center;background:linear-gradient(180deg,#1e294b,#10172e);border-bottom:1px solid rgba(255,255,255,0.08);">
        <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:6px;">URBAN TRACKER</div>
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Email Verification Code</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#cbd5e1;">
          Hello,<br><br>
          Your Urban Tracker verification code is:
        </p>
        <div style="margin:24px 0;padding:20px;text-align:center;background:#030712;border:1.5px solid #0284c7;border-radius:8px;">
          <span style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:800;letter-spacing:8px;color:#38bdf8;display:inline-block;">{otp_code}</span>
        </div>
        <p style="margin:0 0 18px;font-size:13px;line-height:1.5;color:#94a3b8;">
          ⏱️ <strong>This code expires in 5 minutes.</strong><br>
          🔒 Please do not share this code with anyone.<br>
          🛡️ If you did not request this code, you can ignore this email.
        </p>
        <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;font-size:12px;color:#64748b;line-height:1.4;">
          Regards,<br>
          <strong>Urban Tracker Team</strong>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    msg.attach(MIMEText(plain_text, "plain", "utf-8"))
    msg.attach(MIMEText(html_text, "html", "utf-8"))

    # Base64url encode the raw message for Gmail API
    raw_b64 = base64.urlsafe_b64encode(msg.as_bytes()).decode("utf-8")

    try:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "User-Agent": "UrbanTracker-GmailAPI/1.0",
        }
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(
                GMAIL_SEND_ENDPOINT,
                headers=headers,
                json={"raw": raw_b64}
            )

            if resp.status_code == 200:
                data = resp.json()
                msg_id = data.get("id")
                print(f"[AUTH GMAIL API SUCCESS] Delivered OTP email to {clean_recipient} (Message ID: {msg_id})")
                return {
                    "delivered": True,
                    "status": "ACCEPTED",
                    "http_status": 200,
                    "provider": "Gmail-API",
                    "recipient": clean_recipient,
                    "message_id": msg_id,
                    "message": f"Verification code successfully sent to {clean_recipient} via Gmail API."
                }
            else:
                data = resp.json() if "application/json" in resp.headers.get("content-type", "") else {}
                err_detail = data.get("error", {}).get("message") or resp.text
                print(f"[AUTH GMAIL API REJECTED] Failed delivery to {clean_recipient}. HTTP {resp.status_code}: {err_detail}")
                return {
                    "delivered": False,
                    "status": "REJECTED",
                    "http_status": resp.status_code,
                    "provider": "Gmail-API",
                    "recipient": clean_recipient,
                    "reason": "GMAIL_API_REJECTED",
                    "message": f"Gmail API delivery failed (HTTP {resp.status_code}): {err_detail}"
                }
    except Exception as e:
        print(f"[AUTH GMAIL API ERROR] Network error sending to {clean_recipient}: {e}")
        return {
            "delivered": False,
            "status": "NETWORK_ERROR",
            "provider": "Gmail-API",
            "recipient": clean_recipient,
            "reason": "CONNECTION_FAILURE",
            "message": f"Could not connect to Gmail API servers: {str(e)}"
        }
