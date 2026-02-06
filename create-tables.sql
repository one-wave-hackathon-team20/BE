-- ============================================
-- Supabase 테이블 생성 쿼리
-- Supabase SQL Editor에서 전체를 복사하여 실행하세요.
-- ============================================

-- 기존 테이블이 있다면 삭제 (주의: 데이터가 모두 삭제됩니다!)
-- DROP TABLE IF EXISTS analysis_history CASCADE;
-- DROP TABLE IF EXISTS route_steps CASCADE;
-- DROP TABLE IF EXISTS routes CASCADE;
-- DROP TABLE IF EXISTS user_details CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 1. users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NOT NULL,
  onboarding_completed BOOLEAN DEFAULT false
);

-- 2. user_details 테이블 생성
CREATE TABLE IF NOT EXISTS user_details (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job VARCHAR(50) NOT NULL CHECK (job IN ('FRONTEND', 'BACKEND')),
  background VARCHAR(50) NOT NULL CHECK (background IN ('MAJOR', 'NON_MAJOR')),
  company_sizes VARCHAR(500),
  skills VARCHAR(500),
  projects INTEGER DEFAULT 0,
  intern BOOLEAN,
  bootcamp BOOLEAN,
  awards BOOLEAN
);

-- 3. routes 테이블 생성
CREATE TABLE IF NOT EXISTS routes (
  id BIGSERIAL PRIMARY KEY,
  job VARCHAR(50) NOT NULL CHECK (job IN ('FRONTEND', 'BACKEND')),
  background VARCHAR(50) NOT NULL CHECK (background IN ('MAJOR', 'NON_MAJOR')),
  final_company_size VARCHAR(100) NOT NULL,
  skills VARCHAR(500),
  projects INTEGER,
  intern BOOLEAN,
  bootcamp BOOLEAN,
  awards BOOLEAN,
  summary TEXT
);

-- 4. route_steps 테이블 생성
CREATE TABLE IF NOT EXISTS route_steps (
  id BIGSERIAL PRIMARY KEY,
  route_id BIGINT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(100),
  tips TEXT,
  UNIQUE(route_id, step_order)
);

-- 5. analysis_history 테이블 생성
CREATE TABLE IF NOT EXISTS analysis_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matched_route_id BIGINT REFERENCES routes(id) ON DELETE CASCADE,
  similarity INTEGER CHECK (similarity >= 0 AND similarity <= 100),
  reason TEXT,
  strengths TEXT,
  weaknesses TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_details_user_id ON user_details(user_id);
CREATE INDEX IF NOT EXISTS idx_routes_job ON routes(job);
CREATE INDEX IF NOT EXISTS idx_routes_background ON routes(background);
CREATE INDEX IF NOT EXISTS idx_route_steps_route_id ON route_steps(route_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at DESC);

-- RLS 비활성화 (Service Role Key 사용을 위해)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE route_steps DISABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history DISABLE ROW LEVEL SECURITY;

-- 기존 RLS 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Enable all for service role" ON users;
DROP POLICY IF EXISTS "Enable all for service role" ON user_details;
DROP POLICY IF EXISTS "Enable all for service role" ON routes;
DROP POLICY IF EXISTS "Enable all for service role" ON route_steps;
DROP POLICY IF EXISTS "Enable all for service role" ON analysis_history;
