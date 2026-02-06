import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovoxloqrinvhvdzqvioi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92b3hsb3FyaW52aHZkenF2aW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTQzOTAsImV4cCI6MjA4NTk3MDM5MH0.Tua5WxhcD7QqmFfb1iP57dnDMr_apve6C_Hxc_A_2Yk';

// 서버 사이드에서만 사용하는 Supabase 클라이언트 (Service Role Key 사용)
// Service Role Key는 RLS를 우회하므로 모든 테이블에 접근 가능
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
  },
});
