-- Supabase 데이터베이스 스키마 생성 SQL
-- 이 파일의 SQL을 Supabase SQL Editor에서 실행하세요.

-- 1. users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NOT NULL,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  intern BOOLEAN DEFAULT false,
  bootcamp BOOLEAN DEFAULT false,
  awards BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(route_id, step_order)
);

-- 5. analysis_history 테이블 생성
CREATE TABLE IF NOT EXISTS analysis_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matched_route_id BIGINT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  similarity INTEGER CHECK (similarity >= 0 AND similarity <= 100),
  reason TEXT,
  strengths TEXT,
  weaknesses TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_details_user_id ON user_details(user_id);
CREATE INDEX IF NOT EXISTS idx_routes_job ON routes(job);
CREATE INDEX IF NOT EXISTS idx_routes_background ON routes(background);
CREATE INDEX IF NOT EXISTS idx_route_steps_route_id ON route_steps(route_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at DESC);

-- RLS (Row Level Security) 정책 설정 (선택사항)
-- Supabase는 기본적으로 RLS를 활성화하므로, 필요에 따라 정책을 설정하세요.
-- 여기서는 개발 편의를 위해 RLS를 비활성화하는 방법도 제공합니다.

-- RLS 비활성화 (개발 환경용 - 프로덕션에서는 권장하지 않음)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE route_steps DISABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history DISABLE ROW LEVEL SECURITY;

-- 샘플 데이터 삽입 (선택사항)
-- INSERT INTO routes (job, background, final_company_size, skills, projects, intern, bootcamp, awards, summary)
-- VALUES 
--   ('FRONTEND', 'MAJOR', '대기업', 'React,TypeScript,Next.js', 3, true, false, true, '컴퓨터공학 전공으로 시작하여 React 중심의 프론트엔드 개발을 학습했습니다.'),
--   ('BACKEND', 'NON_MAJOR', '중소기업', 'Java,Spring Boot,MySQL', 2, false, true, false, '비전공자로 부트캠프를 수료한 후 Java 백엔드 개발자로 성장했습니다.');
