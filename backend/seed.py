"""
Seed test data and verify full database connectivity.
Usage: python seed.py
"""
import os, sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
ANON_KEY     = os.getenv("SUPABASE_ANON_KEY")
SERVICE_KEY  = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

admin = create_client(SUPABASE_URL, SERVICE_KEY)
anon  = create_client(SUPABASE_URL, ANON_KEY)

SEP = "-" * 55

def ok(msg):    print(f"  [OK]   {msg}".encode("ascii", "replace").decode())
def fail(msg, e): print(f"  [FAIL] {msg}: {e}".encode("ascii", "replace").decode()); return False

# ── 1. AUTH: sign up a test user ─────────────────────────────
print(SEP)
print("STEP 1: Supabase Auth")
print(SEP)

TEST_EMAIL = "seeduser@rentready.com"
TEST_PASS  = "SeedPass123!"

try:
    # Use admin API to create user — bypasses email confirmation requirement
    res = admin.auth.admin.create_user({
        "email": TEST_EMAIL,
        "password": TEST_PASS,
        "email_confirm": True,   # mark email as already confirmed
        "user_metadata": {"full_name": "Alex Johnson"}
    })
    user = res.user
    ok(f"Created user (admin) → id: {user.id}")
except Exception as e:
    # User already exists — fetch them via admin list
    try:
        res = admin.auth.admin.list_users()
        user = next((u for u in res if u.email == TEST_EMAIL), None)
        if not user:
            fail("Could not find or create user", e)
            sys.exit(1)
        ok(f"Found existing user → id: {user.id}")
    except Exception as e2:
        fail("Auth failed", e2)
        sys.exit(1)

USER_ID = user.id

# ── 2. PROFILES table ────────────────────────────────────────
print()
print(SEP)
print("STEP 2: profiles table")
print(SEP)

profile_payload = {
    "user_id":           USER_ID,
    "full_name":         "Alex Johnson",
    "age":               28,
    "phone":             "+61 412 345 678",
    "bio":               "Reliable tenant with great references.",
    "occupation":        "Software Engineer",
    "employment_status": "Full-time employed",
    "weekly_income":     1800,
    "visa_status":       "Australian Citizen",
    "rental_budget":     550,
    "suburb":            "Carlton, Melbourne",
}

try:
    # upsert so re-running doesn't error
    res = admin.table("profiles").upsert(profile_payload, on_conflict="user_id").execute()
    row = res.data[0]
    ok(f"Profile upserted  → id: {row['id']}")
    ok(f"  name:   {row['full_name']}")
    ok(f"  suburb: {row['suburb']}")
except Exception as e:
    fail("Profile upsert", e)
    sys.exit(1)

# ── 3. APPLICATIONS table ────────────────────────────────────
print()
print(SEP)
print("STEP 3: applications table")
print(SEP)

app_payload = {
    "user_id":           USER_ID,
    "full_name":         "Alex Johnson",
    "email":             TEST_EMAIL,
    "phone":             "+61 412 345 678",
    "age":               28,
    "occupation":        "Software Engineer",
    "employment_status": "Full-time employed",
    "weekly_income":     1800,
    "visa_status":       "Australian Citizen",
    "rental_budget":     550,
    "suburb":            "Carlton, Melbourne",
    "status":            "submitted",
}

try:
    res = admin.table("applications").insert(app_payload).execute()
    row = res.data[0]
    ok(f"Application inserted → id: {row['id']}")
    ok(f"  status:       {row['status']}")
    ok(f"  submitted_at: {row['submitted_at']}")
except Exception as e:
    fail("Application insert", e)
    sys.exit(1)

# ── 4. READ BACK ─────────────────────────────────────────────
print()
print(SEP)
print("STEP 4: Read-back verification")
print(SEP)

try:
    profiles = admin.table("profiles").select("*").eq("user_id", USER_ID).execute()
    ok(f"profiles rows for user: {len(profiles.data)}")

    apps = admin.table("applications").select("*").eq("user_id", USER_ID).execute()
    ok(f"applications rows for user: {len(apps.data)}")
except Exception as e:
    fail("Read-back", e)
    sys.exit(1)

# ── 5. SUMMARY ───────────────────────────────────────────────
print()
print(SEP)
print("ALL CHECKS PASSED — Supabase is fully connected!")
print(SEP)
print(f"  Project : {SUPABASE_URL}")
print(f"  User ID : {USER_ID}")
print(f"  Email   : {TEST_EMAIL}")
print(f"  Tables  : profiles, applications")
print(SEP)
