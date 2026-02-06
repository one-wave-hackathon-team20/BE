# 데이터베이스 연결 문제 해결 가이드

## 현재 에러
```
java.net.NoRouteToHostException: No route to host
```

이 에러는 애플리케이션이 Supabase PostgreSQL 데이터베이스에 연결할 수 없을 때 발생합니다.

## 해결 방법

### 1. Supabase 데이터베이스 상태 확인
- Supabase 대시보드에서 프로젝트가 활성화되어 있는지 확인
- 데이터베이스 연결 정보가 올바른지 확인

### 2. 네트워크 연결 확인
```bash
# 데이터베이스 호스트에 연결 가능한지 확인
ping db.wzchbdlcnycaimiowcei.supabase.co

# 포트가 열려있는지 확인
telnet db.wzchbdlcnycaimiowcei.supabase.co 5432
```

### 3. 방화벽 설정 확인
- Supabase 대시보드에서 IP 화이트리스트 설정 확인
- 로컬 네트워크에서 데이터베이스 접근이 허용되어 있는지 확인

### 4. 로컬 PostgreSQL 사용 (개발 환경)

로컬에서 PostgreSQL을 실행하고 `application-dev.yml`을 사용하세요:

```bash
# PostgreSQL 설치 (macOS)
brew install postgresql@17
brew services start postgresql@17

# 데이터베이스 생성
createdb postgres
```

애플리케이션 실행 시:
```bash
# 개발 프로파일 사용
./gradlew bootRun --args='--spring.profiles.active=dev'
```

또는 IDE에서 실행 시 VM 옵션:
```
-Dspring.profiles.active=dev
```

### 5. 데이터베이스 연결 정보 업데이트

`application.yml`에서 데이터베이스 연결 정보를 확인하고 필요시 수정:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://YOUR_DB_HOST:5432/postgres?sslmode=require
    username: YOUR_USERNAME
    password: YOUR_PASSWORD
```

### 6. 임시 해결책 (권장하지 않음)

데이터베이스 연결 없이 애플리케이션을 시작하려면 (테스트 목적):

1. `application.yml`에서 `ddl-auto`를 `validate` 또는 `none`으로 변경
2. 데이터베이스 연결을 지연 초기화하도록 설정

하지만 이 방법은 실제 데이터베이스 작업이 필요할 때 문제가 발생할 수 있습니다.

## 권장 사항

1. **개발 환경**: 로컬 PostgreSQL 사용 (`application-dev.yml`)
2. **프로덕션 환경**: Supabase 데이터베이스 연결 정보 확인 및 네트워크 설정 점검
