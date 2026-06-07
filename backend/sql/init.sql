-- RentReady Database Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name    TEXT NOT NULL,
  age          INTEGER,
  phone        TEXT NOT NULL,
  bio          TEXT,
  occupation   TEXT,
  employment_status TEXT,
  weekly_income     NUMERIC,
  visa_status       TEXT,
  rental_budget     NUMERIC,
  suburb            TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  email        TEXT,
  phone        TEXT,
  age          INTEGER,
  occupation   TEXT,
  employment_status TEXT,
  weekly_income     NUMERIC,
  visa_status       TEXT,
  rental_budget     NUMERIC,
  suburb            TEXT,
  status            TEXT DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/write their own row
CREATE POLICY "profiles_owner" ON profiles
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Applications: users can only read/write their own rows
CREATE POLICY "applications_owner" ON applications
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
