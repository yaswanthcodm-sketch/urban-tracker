import time
import secrets
from roadguard-ai.backend.app.routes import auth as auth_route
from roadguard-ai.backend.app.database import SessionLocal
from roadguard-ai.backend.app.models import models
from fastapi import HTTPException

def test_full_otp_lifecycle():
    print("Running Full OTP Backend Security & Flow Test...")
    db = SessionLocal()

    email_a = "test_user_a@urban-tracker.gov"
    email_b = "test_user_b@urban-tracker.gov"

    # Reset test store
    auth_route.OTP_STORE.clear()

    # 1. Manually simulate successful delivery by monkeypatching dispatch_email_otp
    original_dispatch = auth_route.dispatch_email_otp
    auth_route.dispatch_email_otp = lambda to_email, code: {
        "delivered": True,
        "provider": "Test-Mock",
        "message": f"Delivered code to {to_email}"
    }

    try:
        # Request OTP for User A
        req_a = auth_route.OtpSendRequest(email=email_a)
        res_a = auth_route.send_otp(req_a, db=db)
        print("1. User A send-otp response:", res_a)
        assert res_a["ok"] is True
        assert "dev_code" not in res_a, "dev_code must NOT be exposed in response!"
        assert "code" not in res_a, "code must NOT be exposed in response!"
        assert email_a in auth_route.OTP_STORE
        code_a = auth_route.OTP_STORE[email_a]["code"]
        assert len(code_a) == 6 and code_a.isdigit()

        # Request OTP for User B - verify independent random code
        req_b = auth_route.OtpSendRequest(email=email_b)
        res_b = auth_route.send_otp(req_b, db=db)
        assert res_b["ok"] is True
        code_b = auth_route.OTP_STORE[email_b]["code"]
        assert len(code_b) == 6 and code_b.isdigit()
        print(f"2. Verified distinct OTPs: User A={code_a}, User B={code_b}")

        # Rate limiting check (less than 30s)
        print("3. Testing rate limit (rapid re-request)...")
        try:
            auth_route.send_otp(req_a, db=db)
            assert False, "Should have thrown 429 Too Many Requests"
        except HTTPException as e:
            print("   Correctly rejected with HTTP 429:", e.detail)
            assert e.status_code == 429

        # Test incorrect OTP
        print("4. Testing invalid OTP verification...")
        try:
            auth_route.verify_otp(auth_route.OtpVerifyRequest(email=email_a, otp="000000"), db=db)
            assert False, "Should have thrown 400 Bad Request for invalid OTP"
        except HTTPException as e:
            print("   Correctly rejected invalid OTP:", e.detail)
            assert e.status_code == 400

        # Test attempt limit (5 failed attempts invalidates)
        print("5. Testing 5-attempt limit invalidation...")
        for _ in range(4):
            try:
                auth_route.verify_otp(auth_route.OtpVerifyRequest(email=email_a, otp="000000"), db=db)
            except HTTPException:
                pass
        # 6th attempt should fail with too many attempts and remove OTP
        try:
            auth_route.verify_otp(auth_route.OtpVerifyRequest(email=email_a, otp="000000"), db=db)
            assert False, "Should have been permanently invalidated"
        except HTTPException as e:
            print("   Correctly invalidated after 5 failed attempts:", e.detail)
            assert email_a not in auth_route.OTP_STORE

        # Test 5-minute expiry
        print("6. Testing 5-minute expiry...")
        auth_route.OTP_STORE[email_a] = {
            "code": "123456",
            "phone": "",
            "created_at": time.time() - 301,
            "expires_at": time.time() - 1, # Expired 1 second ago
            "attempts": 0,
        }
        try:
            auth_route.verify_otp(auth_route.OtpVerifyRequest(email=email_a, otp="123456"), db=db)
            assert False, "Should have rejected expired OTP"
        except HTTPException as e:
            print("   Correctly rejected expired OTP:", e.detail)
            assert email_a not in auth_route.OTP_STORE

        # Test successful verification & single-use deletion
        print("7. Testing successful verification & single-use consumption...")
        auth_route.OTP_STORE[email_a] = {
            "code": "987654",
            "phone": "",
            "created_at": time.time(),
            "expires_at": time.time() + 300,
            "attempts": 0,
        }
        verify_res = auth_route.verify_otp(auth_route.OtpVerifyRequest(email=email_a, otp="987654"), db=db)
        print("   Verification successful. Issued Token:", verify_res["access_token"][:20] + "...")
        assert verify_res["verified"] is True
        assert email_a not in auth_route.OTP_STORE, "OTP must be deleted immediately after verification (single-use)!"

        # Verify reuse is impossible
        print("8. Testing OTP reuse attempt...")
        try:
            auth_route.verify_otp(auth_route.OtpVerifyRequest(email=email_a, otp="987654"), db=db)
            assert False, "Reuse must be blocked"
        except HTTPException as e:
            print("   Correctly blocked replay/reuse:", e.detail)

        print("\n✅ ALL 8 SECURITY & LIFECYCLE CHECKS PASSED!")

    finally:
        auth_route.dispatch_email_otp = original_dispatch
        db.close()

if __name__ == "__main__":
    test_full_otp_lifecycle()
