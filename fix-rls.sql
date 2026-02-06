-- RLS 비활성화 (Supabase SQL Editor에서 실행)
-- 이 SQL을 실행하면 모든 테이블의 RLS가 비활성화됩니다.

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE route_steps DISABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history DISABLE ROW LEVEL SECURITY;

-- RLS 정책이 있는지 확인 (있다면 삭제)
DROP POLICY IF EXISTS "Enable all for service role" ON users;
DROP POLICY IF EXISTS "Enable all for service role" ON user_details;
DROP POLICY IF EXISTS "Enable all for service role" ON routes;
DROP POLICY IF EXISTS "Enable all for service role" ON route_steps;
DROP POLICY IF EXISTS "Enable all for service role" ON analysis_history;
