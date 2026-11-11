"""
Urban Tracker — Backend MailBot Service
Automated, headless transactional email-dispatch engine running strictly in the backend.
Supports Resend (HTTPS REST API), Brevo, and standard SMTP.
"""
import json
import logging
import re
import smtplib
import ssl
import urllib.error
import urllib.request
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Any, Optional

import certifi

from ..config import settings

logger = logging.getLogger("UrbanTracker.MailBot")


def _get_ssl_context() -> ssl.SSLContext:
    try:
        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx


def _render_otp_html(otp_code: str) -> str:
    """Renders a responsive, modern HTML email template with Urban Tracker styling."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urban Tracker Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#050814;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050814;padding:40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:540px;background:#0d1527;border:1px solid #1e293b;border-radius:16px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <tr>
            <td style="padding:32px 36px;border-bottom:1px solid #1e293b;background:linear-gradient(180deg,#131f38 0%,#0d1527 100%);">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <span style="display:inline-block;background:#38bdf8;color:#050814;font-size:11px;font-weight:800;letter-spacing:1.5px;padding:4px 10px;border-radius:6px;text-transform:uppercase;">Urban Tracker</span>
                    <h1 style="margin:12px 0 0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Security Verification Code</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 36px 28px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#94a3b8;">
                Hello,
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#cbd5e1;">
                Use the single-use 6-digit verification code below to confirm your identity on <strong>Urban Tracker</strong>.
              </p>
              <div style="background:#050814;border:1px solid #38bdf8;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                <span style="display:block;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#38bdf8;margin-bottom:8px;">Your 6-Digit Passcode</span>
                <span style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:36px;font-weight:800;letter-spacing:10px;color:#ffffff;display:inline-block;padding-left:10px;">{otp_code}</span>
              </div>
              <p style="margin:0 0 12px;font-size:13px;color:#f59e0b;font-weight:500;">
                ⚠️ This code expires in <strong>5 minutes</strong> and can only be used once.
              </p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
                If you did not request this verification code, please ignore this email. No action is required.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px;background:#090e1c;border-top:1px solid #1e293b;text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                Automated message from <strong>Urban Tracker MailBot</strong> · Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


class UrbanTrackerMailBot:
    """
    Automated Transactional Dispatcher.
    Works natively on Google Cloud Run and local environments via HTTPS REST API.
    """

    def __init__(self):
        self.provider = (settings.MAILBOT_PROVIDER or "resend").lower().strip()
        self.from_email = settings.MAILBOT_FROM_EMAIL.strip()
        self.reply_to = settings.MAILBOT_REPLY_TO.strip()

    def send_otp(self, to_email: str, otp_code: str) -> Dict[str, Any]:
        """
        Dispatches an OTP verification email to the user-entered email address.
        Never logs or leaks the OTP code.
        """
        subject = "Urban Tracker — Verification Code"
        html_body = _render_otp_html(otp_code)
        text_body = (
            f"Urban Tracker Security Verification Code\n\n"
            f"Your verification passcode is: {otp_code}\n\n"
            f"This code expires in 5 minutes and is single-use.\n"
            f"If you did not request this, please ignore this message.\n\n"
            f"— Urban Tracker MailBot"
        )

        return self._dispatch(
            to_email=to_email,
            subject=subject,
            html_content=html_body,
            text_content=text_body,
        )

    def send_contact(self, name: str, from_email: str, subject: str, message: str) -> Dict[str, Any]:
        """Dispatches an inquiry from the Contact Us form."""
        sub = f"Urban Tracker Inquiry: {subject}" if subject else "Urban Tracker Contact Form Message"
        html_body = f"""
        <div style="font-family:sans-serif;background:#0d1527;color:#f1f5f9;padding:24px;border-radius:12px;">
          <h2 style="color:#38bdf8;margin-top:0;">New Contact Inquiry</h2>
          <p><strong>From:</strong> {name} &lt;{from_email}&gt;</p>
          <p><strong>Subject:</strong> {subject}</p>
          <hr style="border:0;border-top:1px solid #1e293b;margin:16px 0;" />
          <p style="white-space:pre-wrap;line-height:1.6;">{message}</p>
        </div>
        """
        text_body = f"From: {name} <{from_email}>\nSubject: {subject}\n\n{message}"
        dest = settings.MAILBOT_REPLY_TO or from_email
        return self._dispatch(
            to_email=dest,
            subject=sub,
            html_content=html_body,
            text_content=text_body,
        )

    def _dispatch(self, to_email: str, subject: str, html_content: str, text_content: str) -> Dict[str, Any]:
        """Routes message to the configured transactional driver."""
        provider = self.provider

        if provider == "resend":
            return self._send_resend(to_email, subject, html_content, text_content)
        elif provider == "brevo":
            return self._send_brevo(to_email, subject, html_content, text_content)
        elif provider == "smtp":
            return self._send_smtp(to_email, subject, html_content, text_content)
        else:
            return {
                "accepted": False,
                "reason": f"Unknown email provider '{provider}'. Please configure 'resend', 'brevo', or 'smtp'.",
            }

    def _send_resend(self, to_email: str, subject: str, html_content: str, text_content: str) -> Dict[str, Any]:
        """Dispatches email through Resend REST API (Google Cloud Run compatible)."""
        api_key = (settings.RESEND_API_KEY or "").strip()
        if not api_key:
            return {"accepted": False, "reason": "Resend API key is not configured on the backend."}

        payload = {
            "from": self.from_email,
            "to": [to_email],
            "subject": subject,
            "html": html_content,
            "text": text_content,
        }
        if self.reply_to:
            payload["reply_to"] = self.reply_to

        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "UrbanTrackerMailBot/1.0",
            },
            method="POST",
        )

        ctx = _get_ssl_context()
        try:
            with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                msg_id = data.get("id", "")
                logger.info(f"[MailBot] Resend accepted delivery to {to_email}. Message ID: {msg_id}")
                return {"accepted": True, "provider": "Resend", "message_id": msg_id}
        except urllib.error.HTTPError as error:
            try:
                err_data = json.loads(error.read().decode("utf-8"))
                err_msg = err_data.get("message") or err_data.get("detail") or "Provider rejected the request."
            except Exception:
                err_msg = f"HTTP {error.code} error from Resend."
            logger.warning(f"[MailBot] Resend rejected dispatch to {to_email}: {err_msg}")
            return {"accepted": False, "status": error.code, "reason": err_msg}
        except (urllib.error.URLError, TimeoutError) as e:
            logger.error(f"[MailBot] Network timeout connecting to Resend: {str(e)}")
            return {"accepted": False, "reason": "Connection to email delivery provider timed out."}

    def _send_brevo(self, to_email: str, subject: str, html_content: str, text_content: str) -> Dict[str, Any]:
        """Dispatches email through Brevo REST API."""
        api_key = (settings.BREVO_API_KEY or "").strip()
        if not api_key:
            return {"accepted": False, "reason": "Brevo API key is not configured on the backend."}

        # Extract name and email from from_email (e.g. "Name <email@dom.com>")
        sender_name = "Urban Tracker MailBot"
        sender_email = self.from_email
        match = re.match(r"^([^<]+)<([^>]+)>$", self.from_email)
        if match:
            sender_name = match.group(1).strip()
            sender_email = match.group(2).strip()

        payload = {
            "sender": {"name": sender_name, "email": sender_email},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_content,
            "textContent": text_content,
        }
        if self.reply_to:
            payload["replyTo"] = {"email": self.reply_to}

        req = urllib.request.Request(
            "https://api.brevo.com/v3/smtp/email",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "api-key": api_key,
                "Content-Type": "application/json",
                "User-Agent": "UrbanTrackerMailBot/1.0",
            },
            method="POST",
        )

        ctx = _get_ssl_context()
        try:
            with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                msg_id = data.get("messageId", "")
                logger.info(f"[MailBot] Brevo accepted delivery to {to_email}. Message ID: {msg_id}")
                return {"accepted": True, "provider": "Brevo", "message_id": msg_id}
        except urllib.error.HTTPError as error:
            try:
                err_data = json.loads(error.read().decode("utf-8"))
                err_msg = err_data.get("message") or "Brevo rejected request."
            except Exception:
                err_msg = f"HTTP {error.code} error from Brevo."
            return {"accepted": False, "status": error.code, "reason": err_msg}
        except Exception as e:
            return {"accepted": False, "reason": f"Brevo connection error: {str(e)}"}

    def _send_smtp(self, to_email: str, subject: str, html_content: str, text_content: str) -> Dict[str, Any]:
        """Dispatches email via standard authenticated SMTP."""
        if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            return {"accepted": False, "reason": "SMTP host, user, or password not configured."}

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.from_email
        msg["To"] = to_email
        if self.reply_to:
            msg["Reply-To"] = self.reply_to

        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        ctx = _get_ssl_context()
        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
                server.ehlo()
                server.starttls(context=ctx)
                server.ehlo()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(self.from_email, [to_email], msg.as_string())
            return {"accepted": True, "provider": "SMTP"}
        except Exception as e:
            return {"accepted": False, "reason": f"SMTP delivery failed: {str(e)}"}


mailbot = UrbanTrackerMailBot()
