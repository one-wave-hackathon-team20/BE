# 🚀 배포 가이드

## 📋 GitHub Secrets 설정

배포를 위해 다음 secrets을 GitHub 레포지토리에 추가해야 합니다:

### 1. GCP 관련
- `GCP_PROJECT_ID`: Google Cloud 프로젝트 ID
- `GCP_SA_KEY`: Service Account JSON 키

### 2. Database (Supabase)
- `SUPABASE_URL`: https://wzchbdlcnycaimiowcei.supabase.co
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `DB_URL`: jdbc:postgresql://db.wzchbdlcnycaimiowcei.supabase.co:5432/postgres?sslmode=require&connectTimeout=30&socketTimeout=30&loginTimeout=30
- `DB_USERNAME`: postgres
- `DB_PASSWORD`: 데이터베이스 비밀번호

### 3. JWT
- `JWT_SECRET`: JWT 서명용 비밀키 (최소 256비트)
- `JWT_ACCESS_TOKEN_EXPIRATION`: 3600000 (1시간)
- `JWT_REFRESH_TOKEN_EXPIRATION`: 604800000 (7일)

### 4. Google Gemini API
- `GEMINI_API_KEY`: Gemini API 키
- `GEMINI_PROJECT_ID`: GCP 프로젝트 ID
- `GEMINI_LOCATION`: us-central1

### 5. Redis (Optional)
- `REDIS_HOST`: Redis 호스트 (예: localhost)
- `REDIS_PORT`: 6379
- `REDIS_PASSWORD`: Redis 비밀번호 (없으면 빈 문자열)

## 🔧 GitHub Secrets 등록 방법

1. GitHub 레포지토리로 이동
2. **Settings** > **Secrets and variables** > **Actions** 클릭
3. **New repository secret** 버튼 클릭
4. 위의 각 secret을 등록

## 🌍 환경별 설정

### 로컬 개발 환경
- `.env` 파일 사용
- `application.yml` (기본) 또는 `application-dev.yml` 사용
- H2 인메모리 DB 또는 로컬 PostgreSQL

### 운영 환경 (Cloud Run)
- GitHub Secrets의 환경변수 사용
- `application-prod.yml` 사용
- Supabase PostgreSQL 사용
- 배포 브랜치: `feature/1-deploy`

## 📦 배포 프로세스

1. `feature/1-deploy` 브랜치에 push
2. GitHub Actions 자동 실행
3. Docker 이미지 빌드 (Gradle build 포함)
4. GCP Artifact Registry에 push
5. Cloud Run에 배포

## ⚠️ 주의사항

- **절대 `.env` 파일을 Git에 커밋하지 마세요!**
- `.env.example` 파일을 참고해서 각자 환경에 맞게 `.env` 생성
- 운영 환경의 `ddl-auto`는 `validate`로 설정 (데이터 손실 방지)
- JWT secret은 충분히 긴 랜덤 문자열 사용 (최소 256비트)
