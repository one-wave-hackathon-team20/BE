# API 설정 가이드

이 문서는 Next.js 풀스택 애플리케이션의 API 설정 방법을 안내합니다.

## 1. 필요한 패키지 설치

다음 명령어로 필요한 패키지를 설치하세요:

```bash
npm install @supabase/supabase-js jsonwebtoken bcryptjs @google/generative-ai
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
```

## 2. Supabase 설정

### 2-1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트 설정에서 다음 정보를 확인합니다:
   - Project URL
   - Service Role Key (Settings > API > service_role key)

### 2-2. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 SQL Editor를 엽니다.
2. `supabase-schema.sql` 파일의 내용을 복사하여 실행합니다.
3. 모든 테이블과 인덱스가 생성되었는지 확인합니다.

### 2-3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT 설정
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_change_in_production

# Gemini API 설정
GEMINI_API_KEY=your_gemini_api_key

# API Base URL (선택사항, 기본값: 현재 도메인)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

**중요:** 
- `.env.local` 파일은 `.gitignore`에 추가되어 있어야 합니다.
- 프로덕션 환경에서는 강력한 JWT_SECRET과 JWT_REFRESH_SECRET을 사용하세요.

## 3. Gemini API 설정

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키를 생성합니다.
2. 생성한 API 키를 `.env.local` 파일의 `GEMINI_API_KEY`에 추가합니다.

## 4. 구현된 API 엔드포인트

### Auth API
- `POST /api/v1/auth/signup` - 회원가입
- `POST /api/v1/auth/login` - 로그인

### User API
- `POST /api/v1/users/me/onboarding` - 최초 스펙 입력
- `PATCH /api/v1/users/me` - 스펙 수정
- `GET /api/v1/users/me` - 내 정보 조회

### Route API
- `GET /api/v1/routes` - 합격 사례 목록 조회 (필터링 지원)
- `GET /api/v1/routes/{id}` - 특정 합격자 상세 정보 조회

### Analysis API
- `POST /api/v1/analysis` - AI 분석 수행
- `GET /api/v1/analysis/latest` - 최근 분석 결과 조회

## 5. 개발 서버 실행

```bash
npm run dev
```

서버는 `http://localhost:3000`에서 실행됩니다.

## 6. API 테스트

### 회원가입 예시

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nickname": "테스트유저"
  }'
```

### 로그인 예시

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 7. 주의사항

1. **보안**: 프로덕션 환경에서는 반드시 강력한 JWT_SECRET을 사용하고, HTTPS를 사용하세요.
2. **RLS**: Supabase의 Row Level Security를 사용하려면 `supabase-schema.sql`의 RLS 설정을 수정하세요.
3. **에러 처리**: 모든 API는 표준화된 `ApiResponse` 형식으로 응답합니다.
4. **토큰 관리**: Access Token은 15분, Refresh Token은 7일간 유효합니다.

## 8. 문제 해결

### Supabase 연결 오류
- 환경 변수가 올바르게 설정되었는지 확인하세요.
- Supabase 프로젝트가 활성화되어 있는지 확인하세요.

### Gemini API 오류
- API 키가 올바른지 확인하세요.
- API 할당량을 확인하세요.

### JWT 토큰 오류
- JWT_SECRET과 JWT_REFRESH_SECRET이 설정되었는지 확인하세요.
- 토큰이 만료되지 않았는지 확인하세요.
