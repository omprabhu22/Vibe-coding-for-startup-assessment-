"""
Creates the RentReady tables in Supabase.
Usage: python setup_db.py
"""
import os, sys, httpx
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_KEY  = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
PROJECT_REF  = SUPABASE_URL.split("//")[1].split(".")[0] if SUPABASE_URL else None

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

SQL = """
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name         TEXT NOT NULL,
  age               INTEGER,
  phone             TEXT NOT NULL,
  bio               TEXT,
  occupation        TEXT,
  employment_status TEXT,
  weekly_income     NUMERIC,
  visa_status       TEXT,
  rental_budget     NUMERIC,
  suburb            TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         TEXT,
  email             TEXT,
  phone             TEXT,
  age               INTEGER,
  occupation        TEXT,
  employment_status TEXT,
  weekly_income     NUMERIC,
  visa_status       TEXT,
  rental_budget     NUMERIC,
  suburb            TEXT,
  status            TEXT DEFAULT 'submitted',
  submitted_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='profiles_owner') THEN
    CREATE POLICY profiles_owner ON profiles USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='applications' AND policyname='applications_owner') THEN
    CREATE POLICY applications_owner ON applications USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
"""

def try_management_api(pat: str):
    """Try Supabase Management API — requires a personal access token."""
    res = httpx.post(
        f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query",
        headers={"Authorization": f"Bearer {pat}", "Content-Type": "application/json"},
        json={"query": SQL},
        timeout=30,
    )
    return res

def try_pg_meta():
    """Try via pg-meta endpoint (available on self-hosted, not cloud)."""
    res = httpx.post(
        f"{SUPABASE_URL}/pg-meta/v1/query",
        headers=HEADERS,
        json={"query": SQL},
        timeout=30,
    )
    return res

if __name__ == "__main__":
    print(f"Project ref: {PROJECT_REF}")

    # Try pg-meta endpoint first
    res = try_pg_meta()
    if res.status_code == 200:
        print("Tables created successfully via pg-meta!")
        sys.exit(0)

    print(f"pg-meta: {res.status_code} — {res.text[:80]}")

    # Try management API if PAT provided as argument
    if len(sys.argv) > 1:
        pat = sys.argv[1]
        res = try_management_api(pat)
        if res.status_code == 200:
            print("Tables created successfully via Management API!")
            sys.exit(0)
        print(f"Management API: {res.status_code} — {res.text[:200]}")

    # Neither worked — print the SQL for manual execution
    print()
    print("=" * 60)
    print("MANUAL STEP REQUIRED")
    print("=" * 60)
    print("Go to: https://supabase.com/dashboard/project/xcsqfjdjmvppttospdhn/sql/new")
    print("Paste and run the SQL from: backend/sql/init.sql")
    print("=" * 60)
