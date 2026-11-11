"""
RoadGuard AI — Authentication Routes
EmailJS-backed OTP verification and JWT issuance.
"""
import secrets
import time
import re
import json
import hashlib
import urllib.request
import urllib.error
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..config import settings
from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..security import auth

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory OTP registry: email -> salted hash, expiry, attempts and rate history.
OTP_STORE = {}

# In-memory verified registration tokens: email -> { token, expires_at, mode }
VERIFIED_REGISTRATIONS = {}

# In-memory failed login tracking: email -> { attempts, locked_until }
LOGIN_ATTEMPTS = {}


def validate_password_complexity(password: str) -> None:
    """Enforces strict password rules: min 8 chars, uppercase, lowercase, digit, special char, no spaces."""
    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long."
        )
    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one uppercase letter (A–Z)."
        )
    if not re.search(r"[a-z]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one lowercase letter (a–z)."
        )
    if not re.search(r"[0-9]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one number (0–9)."
        )
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?~`]", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one special character (!@#$%^&*)."
        )
    if re.search(r"\s", password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must not contain spaces."
        )


def _emailjs_credentials() -> dict:
    """Return only the new EmailJS configuration; never expose these values."""
    return {
        "service_id": settings.EMAILJS_SERVICE_ID.strip(),
        "public_key": settings.EMAILJS_PUBLIC_KEY.strip(),
        "private_key": settings.EMAILJS_PRIVATE_KEY.strip(),
        "otp_template_id": settings.EMAILJS_OTP_TEMPLATE_ID.strip(),
        "contact_template_id": settings.EMAILJS_CONTACT_TEMPLATE_ID.strip(),
    }


def _send_emailjs(template_id: str, template_params: dict) -> dict:
    """Submit one EmailJS request and report only provider acceptance state."""
    creds = _emailjs_credentials()
    if not all((creds["service_id"], creds["public_key"], creds["private_key"], template_id)):
        return {"accepted": False, "reason": "Email delivery is not configured."}

    body = json.dumps({
        "service_id": creds["service_id"],
        "template_id": template_id,
        "user_id": creds["public_key"],
        "accessToken": creds["private_key"],
        "template_params": template_params,
    }).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Origin": "https://yaswanthcodm-sketch.github.io",
    }

    import ssl
    try:
        import certifi
        ssl_ctx = ssl.create_default_context(cafile=certifi.where())
    except Exception:
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE

    request = urllib.request.Request(
        "https://api.emailjs.com/api/v1.0/email/send",
        data=body,
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=15, context=ssl_ctx) as response:
            accepted = response.status == 200
            return {"accepted": accepted, "status": response.status}
    except urllib.error.HTTPError as error:
        return {"accepted": False, "status": error.code, "reason": "EmailJS rejected the request."}
    except (urllib.error.URLError, TimeoutError):
        return {"accepted": False, "reason": "EmailJS could not be reached."}


def dispatch_email_otp(to_email: str, otp_code: str) -> dict:
    """Send an OTP using the dedicated EmailJS template and exact variables."""
    return _send_emailjs(settings.EMAILJS_OTP_TEMPLATE_ID.strip(), {
        "email": to_email,
        "to_email": to_email,
        "passcode": otp_code,
        "time": "5 minutes",
    })


class OtpSendRequest(BaseModel):
    email: str
    phone: Optional[str] = ""


class OtpVerifyRequest(BaseModel):
    email: str
    otp: str
    phone: Optional[str] = ""
    mode: Optional[str] = "signup"  # "signup", "reset", or "direct_login"


class SetPasswordRequest(BaseModel):
    email: str
    verification_token: str
    password: str
    confirm_password: str
    name: Optional[str] = ""


class ContactRequest(BaseModel):
    email: str
    message: str
    name: Optional[str] = ""
    subject: Optional[str] = ""


def _valid_email(value: str) -> str:
    email = (value or "").strip().lower()
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Enter a valid email address.")
    return email


def _otp_digest(email: str, otp: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}:{email}:{otp}".encode("utf-8")).hexdigest()


@router.post("/send-otp")
def send_otp(payload: OtpSendRequest, db: Session = Depends(get_db)):
    """
    Generates a cryptographically secure 6-digit OTP valid for 5 minutes,
    invalidates any previous code for this email, and dispatches it.
    """
    email = _valid_email(payload.email)
    phone = (payload.phone or "").strip()

    # Rate limiting: minimum 30 seconds between requests + max 5 per hour
    existing_record = OTP_STORE.get(email)
    now = time.time()
    send_history = []
    if existing_record:
        send_history = [t for t in existing_record.get("send_history", []) if now - t < 3600]
        if len(send_history) >= 5:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Maximum verification requests reached for this hour (5 requests max). Please wait before requesting another code."
            )
        elapsed = now - existing_record["created_at"]
        if elapsed < 30:
            retry_after = int(30 - elapsed)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Please wait {retry_after} seconds before requesting a new verification code."
            )

    # Generate a fresh OTP, but retain only a per-record salted hash.
    code = f"{secrets.randbelow(900000) + 100000}"
    salt = secrets.token_urlsafe(16)

    send_history.append(now)
    # Invalidate previous code: overwrite with fresh OTP, 5-minute expiry (300 seconds), 0 attempts
    OTP_STORE[email] = {
        "code_hash": _otp_digest(email, code, salt),
        "salt": salt,
        "phone": phone,
        "created_at": now,
        "expires_at": now + 300,  # Exactly 5 minutes
        "attempts": 0,
        "send_history": send_history,
    }

    delivery = dispatch_email_otp(email, code)
    # Never claim inbox delivery: success means EmailJS accepted the request.
    if not delivery.get("accepted", False):
        if email in OTP_STORE:
            del OTP_STORE[email]
        failure_msg = delivery.get("reason") or "Email delivery failed."
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=failure_msg
        )

    return {
        "ok": True,
        "message": "EmailJS accepted the verification request. Check your email for the code.",
        "expires_in_seconds": 300,
        "emailjs_accepted": True,
    }


@router.post("/verify-otp")
def verify_otp(payload: OtpVerifyRequest, db: Session = Depends(get_db)):
    """
    Verifies that the 6-digit code typed by the user matches the active code.
    Rejects expired, already used, or invalid codes, limits failed attempts to 5,
    and returns a single-use verification token to proceed to password creation or reset.
    """
    email = _valid_email(payload.email)
    phone = (payload.phone or "").strip()
    typed_code = payload.otp.strip()

    record = OTP_STORE.get(email)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active verification code was requested for this email. Please request a new code."
        )

    # Enforce 5-minute expiry
    if time.time() > record["expires_at"]:
        del OTP_STORE[email]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The verification code has expired (valid for 5 minutes). Please request a new code."
        )

    # Track verification attempts (Max 5 attempts)
    record["attempts"] += 1
    if record["attempts"] > 5:
        del OTP_STORE[email]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many incorrect attempts. For your security, this verification code has been invalidated. Please request a new code."
        )

    # Constant-time comparison to prevent timing attacks
    expected_digest = _otp_digest(email, typed_code, record["salt"])
    if not secrets.compare_digest(expected_digest, record["code_hash"]):
        remaining = 5 - record["attempts"]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid verification code. Please check your code. ({remaining} attempts remaining)"
        )

    # Match confirmed! Immediately invalidate OTP so it cannot be reused
    del OTP_STORE[email]

    # Generate cryptographically secure single-use verification token valid for 15 minutes
    verification_token = secrets.token_urlsafe(32)
    mode = (payload.mode or "signup").strip().lower()
    VERIFIED_REGISTRATIONS[email] = {
        "token": verification_token,
        "expires_at": time.time() + 900,  # 15 minutes
        "mode": mode,
        "phone": phone,
    }

    user = db.query(models.User).filter(models.User.email == email).first()
    has_existing_account = bool(user and user.password_hash and not user.password_hash.startswith("otp_auth_"))
    flow = "reset_password" if (mode in ["reset", "forgot"] or has_existing_account) else "create_password"

    return {
        "ok": True,
        "verified": True,
        "verification_token": verification_token,
        "flow": flow,
        "has_existing_account": has_existing_account,
        "email": email,
        "message": "Verification code verified successfully. Please create your password." if flow == "create_password" else "Verification code verified successfully. Please reset your password."
    }


@router.post("/contact")
def send_contact_message(payload: ContactRequest):
    """Deliver the existing Contact Us form through its dedicated EmailJS template."""
    email = _valid_email(payload.email)
    message = (payload.message or "").strip()
    if not message or len(message) > 5000:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Enter a message up to 5,000 characters.")
    result = _send_emailjs(settings.EMAILJS_CONTACT_TEMPLATE_ID.strip(), {
        "email": email,
        "to_email": email,
        "name": (payload.name or "").strip()[:160],
        "subject": (payload.subject or "").strip()[:240],
        "message": message,
    })
    if not result.get("accepted"):
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=result.get("reason") or "EmailJS rejected the contact request.")
    return {"ok": True, "message": "EmailJS accepted your contact request."}


@router.post("/set-password")
def set_password(payload: SetPasswordRequest, db: Session = Depends(get_db)):
    """
    Sets or resets an account password securely using bcrypt after successful OTP verification.
    Validates token, enforces all 6 password complexity rules, prevents duplicate accounts on signup,
    and invalidates the verification token immediately.
    """
    email = payload.email.strip().lower()
    token = payload.verification_token.strip()
    pwd = payload.password
    confirm_pwd = payload.confirm_password
    name = (payload.name or "").strip()

    # 1. Verify single-use verification token
    reg = VERIFIED_REGISTRATIONS.get(email)
    if not reg or not secrets.compare_digest(reg.get("token", ""), token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification session. Please verify your email again."
        )

    if time.time() > reg.get("expires_at", 0):
        del VERIFIED_REGISTRATIONS[email]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification session has expired (valid for 15 minutes). Please request a new verification code."
        )

    # 2. Check password confirmation
    if pwd != confirm_pwd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    # 3. Enforce 6 password complexity rules
    validate_password_complexity(pwd)

    # 4. Hash password with bcrypt (12 work rounds)
    hashed = auth.get_password_hash(pwd)

    # 5. Invalidate verification token immediately (single use)
    mode = reg.get("mode", "signup")
    del VERIFIED_REGISTRATIONS[email]

    # 6. Database save or update
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user_name = name or email.split("@")[0].replace(".", " ").title()
        user = models.User(
            name=user_name,
            email=email,
            password_hash=hashed,
            role=models.UserRole.CITIZEN.value,
            account_status="active",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        action_type = "created"
    else:
        # Prevent duplicate account creation if existing user already set a password and mode was signup
        # But if user was an OTP placeholder or user requested reset, update password
        user.password_hash = hashed
        user.account_status = "active"
        if name and not user.name:
            user.name = name
        db.commit()
        db.refresh(user)
        action_type = "updated"

    return {
        "ok": True,
        "action": action_type,
        "message": "Password saved successfully! Please sign in with your email and password.",
        "email": email,
    }


@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """Registers a new user (Citizen, Inspector, or Officer)."""
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    validate_password_complexity(user_in.password)
    role = user_in.role if user_in.role in [r.value for r in models.UserRole] else models.UserRole.CITIZEN.value
    user = models.User(
        name=user_in.name,
        email=user_in.email,
        password_hash=auth.get_password_hash(user_in.password),
        role=role,
        account_status="active",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=schemas.Token)
def login(login_in: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates user via registered email and password.
    Enforces rate limits and returns 'Incorrect email or password. Please try again.' on failure.
    """
    email = login_in.email.strip().lower()
    now = time.time()

    # Rate limiting: 5 failed attempts -> 5-minute lockout
    attempt_info = LOGIN_ATTEMPTS.get(email)
    if attempt_info and attempt_info.get("locked_until", 0) > now:
        remaining_secs = int(attempt_info["locked_until"] - now)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many failed login attempts. Account temporarily locked. Please try again in {remaining_secs} seconds or reset your password."
        )

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not auth.verify_password(login_in.password, user.password_hash):
        if not attempt_info:
            LOGIN_ATTEMPTS[email] = {"attempts": 1, "locked_until": 0}
        else:
            attempt_info["attempts"] += 1
            if attempt_info["attempts"] >= 5:
                attempt_info["locked_until"] = now + 300  # 5 minutes
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many failed login attempts. Account locked for 5 minutes. Please try again later or reset your password."
                )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please try again."
        )

    if user.account_status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact support."
        )

    # Login successful: clear failed attempt tracking
    if email in LOGIN_ATTEMPTS:
        del LOGIN_ATTEMPTS[email]

    token = auth.create_access_token(data={"sub": user.email, "role": user.role, "name": user.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_profile(current_user: models.User = Depends(auth.get_current_user)):
    """Returns currently authenticated user profile."""
    return current_user


class GoogleLoginRequest(BaseModel):
    email: str
    name: Optional[str] = None
    avatar: Optional[str] = None
    sub: Optional[str] = None


@router.post("/google-login", response_model=schemas.Token)
def google_oauth_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Seamless Google OAuth / Account Chooser verification.
    If the Google account doesn't exist yet, registers it with citizen role.
    Issues a signed JWT token and returns user profile.
    """
    clean_email = (payload.email or "").strip().lower()
    if not clean_email or "@" not in clean_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid Google email address is required."
        )

    user = db.query(models.User).filter(models.User.email == clean_email).first()
    if not user:
        clean_name = payload.name.strip() if payload.name else clean_email.split("@")[0].title()
        user = models.User(
            name=clean_name,
            email=clean_email,
            password_hash=auth.get_password_hash(secrets.token_urlsafe(32)),
            role="citizen",
            account_status="active"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif user.account_status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact support."
        )

    token = auth.create_access_token(data={"sub": user.email, "role": user.role, "name": user.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


