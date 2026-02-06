# 🔍 Debug Instructions - 403 CORS Error

## 📋 현재 상황

403 에러가 계속 발생하고 있습니다. 정확한 원인을 파악하기 위해 추가 정보가 필요합니다.

---

## 🧪 테스트 방법

### 1. **브라우저에서 테스트 (가장 중요!)**

1. Swagger UI 열기:
   ```
   https://spring-app-177609243769.asia-northeast3.run.app/swagger-ui/index.html
   ```

2. **F12 (개발자 도구) 열기**

3. **Network 탭 열기**

4. signup 엔드포인트 테스트 시도

5. **실패한 요청 클릭**

6. 다음 정보 확인:
   - **Request Headers** - Origin 헤더 값은?
   - **Response Headers** - Access-Control-Allow-Origin 헤더가 있는가?
   - **Response** 탭 - 정확한 에러 메시지는?

### 2. **curl로 OPTIONS 요청 (Preflight)**

```bash
curl -X OPTIONS 'https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/signup' \
  -H 'Origin: https://spring-app-177609243769.asia-northeast3.run.app' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type' \
  -v
```

**체크할 것:**
- HTTP 상태 코드는? (200? 403?)
- `Access-Control-Allow-Origin` 헤더가 응답에 있는가?
- `Access-Control-Allow-Methods` 헤더에 POST가 포함되어 있는가?

### 3. **curl로 실제 POST 요청**

```bash
curl -X POST 'https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/signup' \
  -H 'Origin: https://spring-app-177609243769.asia-northeast3.run.app' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"test123","nickname":"tester"}' \
  -v
```

**체크할 것:**
- HTTP 상태 코드는?
- `Access-Control-Allow-Origin` 헤더가 있는가?
- 실제 응답 body는?

---

## 🔍 확인해야 할 것들

### A. GitHub Actions 배포 로그

1. GitHub 레포 > **Actions** 탭
2. 최신 워크플로우 실행 클릭
3. "Deploy to Cloud Run" 단계 확인
4. 배포가 성공했는가?

### B. Cloud Run 로그

1. GCP Console > Cloud Run
2. `spring-app` 서비스 클릭
3. **LOGS** 탭 클릭
4. 최근 요청 로그 확인
5. 에러 메시지가 있는가?

### C. 환경변수 확인

Cloud Run에서 환경변수가 제대로 주입되었는지:

1. Cloud Run > spring-app 서비스
2. **EDIT & DEPLOY NEW REVISION** (또는 현재 리비전 클릭)
3. **VARIABLES & SECRETS** 탭
4. 다음 변수들이 있는지 확인:
   - `CORS_ALLOWED_ORIGINS` (없어도 됨, 기본값 "*" 사용)
   - `CORS_ALLOW_CREDENTIALS` (없어도 됨, 기본값 false 사용)

---

## 🐛 가능한 원인들

### 1. **배포가 안 된 경우**
- 최신 코드가 배포되지 않았을 수 있음
- GitHub Actions 확인 필요

### 2. **Redis 연결 실패**
- Redis가 없어서 앱이 시작 실패할 수 있음
- 로그에서 Redis 관련 에러 확인

### 3. **데이터베이스 연결 실패**
- Supabase 연결이 안 될 수 있음
- `ddl-auto: validate`이므로 테이블이 없으면 실패

### 4. **JWT 설정 문제**
- JWT_SECRET이 없거나 잘못되었을 수 있음

### 5. **CORS 설정이 실제로 적용 안 됨**
- CorsConfig Bean이 로드 안 되었을 수 있음
- 다른 설정과 충돌

---

## 🛠️ 임시 해결책

### Option 1: CORS 완전히 비활성화 (테스트용)

`SecurityConfig.java`:
```java
http
    .csrf(AbstractHttpConfigurer::disable)
    .cors(AbstractHttpConfigurer::disable)  // CORS 완전히 끄기
    .sessionManagement(...)
```

### Option 2: @CrossOrigin 애너테이션 사용

`AuthController.java`에 추가:
```java
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")  // 컨트롤러에 직접 CORS 설정
@RequiredArgsConstructor
public class AuthController {
    ...
}
```

### Option 3: 로깅 레벨 높이기

`application-prod.yml`:
```yaml
logging:
  level:
    org.springframework.security: DEBUG
    org.springframework.web.cors: DEBUG
    com.onewave.server: DEBUG
```

---

## 📤 필요한 정보

다음 정보를 제공해주시면 정확한 원인을 찾을 수 있습니다:

1. **브라우저 Network 탭 스크린샷**
   - Request Headers
   - Response Headers
   - Response body

2. **Cloud Run 로그** (최근 5-10줄)

3. **GitHub Actions 배포 로그** (Deploy to Cloud Run 부분)

4. **curl 테스트 결과**
   ```bash
   curl -v 위의 명령어 실행 결과
   ```

---

## 🎯 다음 단계

위의 테스트를 수행하고 결과를 알려주세요. 그러면 정확한 해결책을 제시할 수 있습니다!

특히:
1. ✅ 배포가 성공했는지
2. ✅ OPTIONS 요청이 성공하는지 (200 OK?)
3. ✅ 응답에 CORS 헤더가 있는지
4. ✅ 로그에 어떤 에러가 있는지

이 정보들이 있으면 문제를 바로 해결할 수 있습니다! 🚀
