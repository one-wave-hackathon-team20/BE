# 🔐 GitHub Secrets Setup Guide

## 📋 All Required Secrets

You need to register the following **15 Secrets** in your GitHub repository.

---

## 1️⃣ GCP 관련 (배포용)

### `GCP_PROJECT_ID`
**설명**: Google Cloud 프로젝트 ID  
**값**: `your-gcp-project-id`  
**찾는 방법**: GCP Console > 프로젝트 선택 > 프로젝트 ID 확인

### `GCP_SA_KEY`
**설명**: Service Account JSON 키 (전체 JSON 내용)  
**값**: 
```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  ...
}
```
**찾는 방법**: GCP Console > IAM 및 관리자 > 서비스 계정 > 키 만들기 > JSON

---

## 2️⃣ Database (Supabase)

### `SUPABASE_URL`
**설명**: Supabase 프로젝트 URL  
**현재 값**: `https://wzchbdlcnycaimiowcei.supabase.co`

### `SUPABASE_SERVICE_ROLE_KEY`
**설명**: Supabase Service Role 키  
**현재 값**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Y2hiZGxjbnljYWltaW93Y2VpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5NjE1MCwiZXhwIjoyMDg1OTcyMTUwfQ.PNBe5t5eomhcXcsEZP84k0p4s026y65itdAV2ZWOIl4`  
**찾는 방법**: Supabase Dashboard > Settings > API > service_role key

### `DB_URL`
**설명**: PostgreSQL JDBC 연결 URL  
**현재 값**: `jdbc:postgresql://db.wzchbdlcnycaimiowcei.supabase.co:5432/postgres?sslmode=require&connectTimeout=30&socketTimeout=30&loginTimeout=30`

### `DB_USERNAME`
**설명**: 데이터베이스 사용자명  
**현재 값**: `postgres`

### `DB_PASSWORD`
**설명**: 데이터베이스 비밀번호  
**현재 값**: `WSQ4E$sGfEksB$h`  
**찾는 방법**: Supabase Dashboard > Settings > Database > Connection string에서 확인

---

## 3️⃣ JWT

### `JWT_SECRET`
**설명**: JWT 토큰 서명용 비밀키 (최소 256비트 = 32자 이상)  
**현재 값**: `test-secret-key-for-development-min-256-bits-long-string-here-change-in-production`  
**⚠️ 경고**: 운영 환경에서는 반드시 강력한 랜덤 문자열로 변경하세요!  
**생성 방법**: 
```bash
# Linux/Mac
openssl rand -base64 32

# 또는 온라인 생성기 사용
https://randomkeygen.com/
```

### `JWT_ACCESS_TOKEN_EXPIRATION`
**설명**: Access Token 만료 시간 (밀리초)  
**현재 값**: `3600000` (1시간)

### `JWT_REFRESH_TOKEN_EXPIRATION`
**설명**: Refresh Token 만료 시간 (밀리초)  
**현재 값**: `604800000` (7일)

---

## 4️⃣ Google Gemini API

### `GEMINI_API_KEY`
**설명**: Google Gemini API 키  
**현재 값**: `AIzaSyAe9NqeX5L7ACk7mcXPolRej-YpIZF3MIY` ✅ 이미 발급됨!  
**찾는 방법**: 
1. Google AI Studio 접속 (https://aistudio.google.com/)
2. Get API Key 클릭
3. API 키 복사

---

## 5️⃣ Redis (Optional - 없어도 실행 가능)

### `REDIS_HOST`
**설명**: Redis 호스트 주소  
**현재 값**: `localhost`  
**운영 환경**: Redis 서버 주소로 변경 (예: `redis.example.com`)

### `REDIS_PORT`
**설명**: Redis 포트  
**현재 값**: `6379`

### `REDIS_PASSWORD`
**설명**: Redis 비밀번호  
**현재 값**: (비어있음)  
**Redis에 비밀번호가 없으면**: 빈 문자열로 등록

---

## 📝 등록 순서 (복사 & 붙여넣기용)

```
이름: GCP_PROJECT_ID
값: (GCP 프로젝트 ID)

이름: GCP_SA_KEY
값: (Service Account JSON 전체)

이름: SUPABASE_URL
값: https://wzchbdlcnycaimiowcei.supabase.co

이름: SUPABASE_SERVICE_ROLE_KEY
값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Y2hiZGxjbnljYWltaW93Y2VpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5NjE1MCwiZXhwIjoyMDg1OTcyMTUwfQ.PNBe5t5eomhcXcsEZP84k0p4s026y65itdAV2ZWOIl4

이름: DB_URL
값: jdbc:postgresql://db.wzchbdlcnycaimiowcei.supabase.co:5432/postgres?sslmode=require&connectTimeout=30&socketTimeout=30&loginTimeout=30

이름: DB_USERNAME
값: postgres

이름: DB_PASSWORD
값: WSQ4E$sGfEksB$h

이름: JWT_SECRET
값: (강력한 랜덤 문자열 - 최소 32자)

이름: JWT_ACCESS_TOKEN_EXPIRATION
값: 3600000

이름: JWT_REFRESH_TOKEN_EXPIRATION
값: 604800000

이름: GEMINI_API_KEY
값: AIzaSyAe9NqeX5L7ACk7mcXPolRej-YpIZF3MIY

이름: REDIS_HOST
값: localhost

이름: REDIS_PORT
값: 6379

이름: REDIS_PASSWORD
값: (비어있거나 Redis 비밀번호)
```

---

## 🔧 GitHub에 Secrets 등록하는 방법

1. **GitHub 레포지토리로 이동**
2. **Settings** 탭 클릭
3. 왼쪽 사이드바에서 **Secrets and variables** > **Actions** 클릭
4. **New repository secret** 버튼 클릭
5. 위의 각 항목을 **Name**과 **Value**에 입력
6. **Add secret** 버튼 클릭
7. 15개 모두 반복

---

## ⚠️ 중요 보안 사항

### 🚨 반드시 변경해야 할 값:

1. **`JWT_SECRET`**
   - 현재: 테스트용 문자열
   - 변경: 강력한 랜덤 문자열 (최소 32자)
   ```bash
   # 생성 예시
   openssl rand -base64 32
   # 결과: xK7mP9nQ2wR5tY8uI3oE6vB1cA4fD7gH9jL2mN5qS8w=
   ```

### ✅ 현재 값 그대로 사용해도 되는 항목:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (이미 설정됨)
- `GEMINI_API_KEY` (이미 발급됨!) ✅
- `JWT_ACCESS_TOKEN_EXPIRATION`, `JWT_REFRESH_TOKEN_EXPIRATION` (기본값)
- `REDIS_HOST`, `REDIS_PORT` (기본값)

---

## ✅ 설정 완료 확인

모든 Secrets 등록 후:
1. `feature/1-deploy` 브랜치에 push
2. GitHub Actions 탭에서 워크플로우 실행 확인
3. 배포 성공 시 Cloud Run에서 애플리케이션 실행 확인
4. 로그에서 환경변수가 제대로 로드되었는지 확인

문제가 발생하면 GitHub Actions 로그를 확인하세요!
