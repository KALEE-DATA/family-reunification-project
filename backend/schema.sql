-- FAMILYLINK-AI — PostgreSQL Schema for Neon
-- Run this in the Neon SQL editor to create all tables

-- Missing Person Cases
CREATE TABLE IF NOT EXISTS missing_cases (
  id              TEXT PRIMARY KEY,          -- e.g. RF-2026-000123
  person_name     TEXT NOT NULL,
  age             INTEGER,
  gender          TEXT,
  disaster_type   TEXT,
  disaster_name   TEXT,
  incident_date   DATE,
  district        TEXT,
  state           TEXT,
  last_seen_loc   TEXT,
  evacuation_ctr  TEXT,
  physical_desc   TEXT,
  clothing_desc   TEXT,
  medical_info    TEXT,
  language        TEXT,
  reporter_name   TEXT,
  reporter_rel    TEXT,
  reporter_phone  TEXT,
  reporter_email  TEXT,
  status          TEXT DEFAULT 'MISSING',    -- MISSING | MATCH_FOUND | UNDER_VERIFICATION | REUNITED | NO_MATCH
  priority        TEXT DEFAULT 'normal',     -- critical | high | medium | normal
  match_id        TEXT,
  match_score     INTEGER,
  lat             NUMERIC(10,7),
  lng             NUMERIC(10,7),
  photo_url       TEXT,
  assigned_auth   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Found Person Records
CREATE TABLE IF NOT EXISTS found_persons (
  id              TEXT PRIMARY KEY,          -- e.g. FP-2026-000087
  name_if_known   TEXT,
  estimated_age   INTEGER,
  gender          TEXT,
  location_name   TEXT,
  district        TEXT,
  state           TEXT,
  physical_desc   TEXT,
  clothing_desc   TEXT,
  medical_cond    TEXT,
  language        TEXT,
  reported_by     TEXT,
  org_name        TEXT,
  status          TEXT DEFAULT 'PENDING_MATCH', -- PENDING_MATCH | MATCHED | REUNITED | REJECTED
  lat             NUMERIC(10,7),
  lng             NUMERIC(10,7),
  photo_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Case Timeline Events
CREATE TABLE IF NOT EXISTS case_timeline (
  id              SERIAL PRIMARY KEY,
  case_id         TEXT NOT NULL,
  case_type       TEXT NOT NULL,             -- 'missing' or 'found'
  status          TEXT NOT NULL,
  event_time      TIMESTAMPTZ DEFAULT NOW(),
  performed_by    TEXT
);

-- Match Records
CREATE TABLE IF NOT EXISTS matches (
  id              SERIAL PRIMARY KEY,
  missing_id      TEXT REFERENCES missing_cases(id),
  found_id        TEXT REFERENCES found_persons(id),
  total_score     INTEGER,
  name_score      INTEGER,
  age_score       INTEGER,
  gender_score    INTEGER,
  location_score  INTEGER,
  desc_score      INTEGER,
  clothing_score  INTEGER,
  medical_score   INTEGER,
  distance_km     NUMERIC(8,2),
  status          TEXT DEFAULT 'PENDING',    -- PENDING | CONFIRMED | REJECTED
  verified_by     TEXT,
  verified_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_missing_status   ON missing_cases(status);
CREATE INDEX IF NOT EXISTS idx_missing_district ON missing_cases(district);
CREATE INDEX IF NOT EXISTS idx_found_status     ON found_persons(status);
CREATE INDEX IF NOT EXISTS idx_timeline_case    ON case_timeline(case_id);
CREATE INDEX IF NOT EXISTS idx_matches_missing  ON matches(missing_id);
