# 🗺️ [Back-end] 취업난 합격자 루트 맵 — 최종 개발 명세서 (MVP v2)

## 1. 기술 스택 및 개발 환경

- **Core:** Java 17, Spring Boot 3.x
- **Database:** Supabase (PostgreSQL)
- **Security:** Spring Security, JWT (Stateless)
- **Cache:** Redis (Refresh Token 저장 및 AI 분석 결과 캐싱)
- **ORM:** Spring Data JPA, QueryDSL (동적 필터링 처리)
- **AI:** Google Gemini API (Vertex AI 또는 API Key 방식)
- **Strategy:** `ddl-auto: update` (초기 개발 속도 중심)

---

## 2. DB 스키마 설계 (Entity Modeling)

### 2-1. [TABLE: users] - 계정 기본

| 컬럼명               | 타입    | 제약조건         | 설명                |
| :------------------- | :------ | :--------------- | :------------------ |
| id                   | UUID    | PK               | 사용자 고유 식별자  |
| email                | VARCHAR | Unique, Not Null | 로그인 아이디       |
| password             | VARCHAR | Not Null         | 암호화된 비밀번호   |
| nickname             | VARCHAR | Not Null         | 서비스 활동명       |
| onboarding_completed | BOOLEAN | Default: false   | 초기 정보 입력 여부 |

### 2-2. [TABLE: user_details] - 사용자 스펙

| 컬럼명        | 타입    | 제약조건              | 설명                           |
| :------------ | :------ | :-------------------- | :----------------------------- |
| id            | BIGINT  | PK, Auto Increment    |                                |
| user_id       | UUID    | FK (users.id), Unique | 사용자 연관 관계               |
| job           | VARCHAR | Not Null              | FRONTEND / BACKEND             |
| background    | VARCHAR | Not Null              | MAJOR / NON_MAJOR              |
| company_sizes | VARCHAR |                       | 선호 기업 규모 (CSV 형태 저장) |
| skills        | VARCHAR |                       | 보유 기술 스택 (CSV 형태)      |
| projects      | INTEGER | Default: 0            | 진행 프로젝트 수               |
| intern        | BOOLEAN |                       | 인턴 경험 여부                 |
| bootcamp      | BOOLEAN |                       | 부트캠프 수료 여부             |
| awards        | BOOLEAN |                       | 수상 경력 여부                 |

### 2-3. [TABLE: routes] - 합격자 사례 데이터

| 컬럼명             | 타입    | 제약조건           | 설명                            |
| :----------------- | :------ | :----------------- | :------------------------------ |
| id                 | BIGINT  | PK, Auto Increment |                                 |
| job                | VARCHAR | Not Null           | 합격 직무                       |
| background         | VARCHAR | Not Null           | 전공 여부                       |
| final_company_size | VARCHAR | Not Null           | 최종 합격 기업 규모             |
| skills             | VARCHAR |                    | 보유 스택                       |
| projects           | INTEGER |                    | 프로젝트 수                     |
| intern             | BOOLEAN |                    | 인턴 여부                       |
| bootcamp           | BOOLEAN |                    | 부트캠프 여부                   |
| awards             | BOOLEAN |                    | 수상 여부                       |
| summary            | TEXT    |                    | 합격 과정 전체 요약 (AI 참고용) |

### 2-4. [TABLE: route_steps] - 합격 루트 상세 (1:N)

| 컬럼명      | 타입    | 제약조건       | 설명                          |
| :---------- | :------ | :------------- | :---------------------------- |
| id          | BIGINT  | PK             |                               |
| route_id    | BIGINT  | FK (routes.id) |                               |
| step_order  | INTEGER | Not Null       | 단계 순서 (1, 2, 3...)        |
| title       | VARCHAR | Not Null       | 단계 제목 (예: 독학, 인턴 등) |
| description | TEXT    |                | 상세 내용                     |
| duration    | VARCHAR |                | 소요 기간                     |
| tips        | TEXT    |                | 해당 단계 꿀팁                |

### 2-5. [★추가] [TABLE: analysis_history] - AI 분석 결과 저장

| 컬럼명           | 타입      | 제약조건       | 설명                      |
| :--------------- | :-------- | :------------- | :------------------------ |
| id               | BIGINT    | PK             |                           |
| user_id          | UUID      | FK (users.id)  | 분석 대상자               |
| matched_route_id | BIGINT    | FK (routes.id) | 매칭된 합격 사례          |
| similarity       | INTEGER   |                | 유사도 점수 (0~100)       |
| reason           | TEXT      |                | AI가 판단한 매칭 이유     |
| strengths        | TEXT      |                | 사용자 강점 (JSON/CSV)    |
| weaknesses       | TEXT      |                | 사용자 약점 (JSON/CSV)    |
| recommendations  | TEXT      |                | 로드맵 제언 (JSON/CSV)    |
| created_at       | TIMESTAMP | Default: Now   | 분석 시점 (최신화 판별용) |

---

## 3. 핵심 API 리스트

### Auth API

- `POST /api/v1/auth/signup` : 회원가입
- `POST /api/v1/auth/login` : 로그인 (Access/Refresh Token 발급)

### User API

- `POST /api/v1/users/me/onboarding` : 최초 스펙 입력
- `PATCH /api/v1/users/me` : 스펙 수정 (수정 성공 시 분석 결과 무효화 처리)
- `GET /api/v1/users/me` : 내 정보 및 상세 스펙 조회

### Route API (합격 사례 탐색)

- `GET /api/v1/routes?job=...&background=...` : 필터 기반 합격 사례 목록 조회
- `GET /api/v1/routes/{id}` : 특정 합격자 상세 정보 + `route_steps` 포함 반환

### Analysis API

- `POST /api/v1/analysis` :
  1. `user_details`와 전체 `routes` 리스트를 추출.
  2. Gemini API에 전달하여 최적의 `routeId`와 분석 텍스트 수신.
  3. 결과를 `analysis_history`에 저장 후 반환.
- `GET /api/v1/analysis/latest` : 가장 최근에 수행된 분석 결과 조회.

---

## 4. AI 분석 (Gemini) 프롬프트 가이드

- **Persona:** "IT 채용 데이터 분석 전문가"
- **Task:** 사용자의 스펙과 가장 닮은 합격자 데이터를 매칭하고, SWOT 분석을 통해 향후 전략을 제시함.
- **Format:** 반드시 JSON 포맷으로만 응답.

---

## 5. 데모 시나리오 전략

1. **정렬의 일관성:** `route_steps` 반환 시 `step_order` 오름차순 정렬 필수.
2. **동적 변화 강조:** - 사용자가 '인턴 없음' 상태에서 분석 -> 'A 중소기업 루트' 추천.
   - 마이페이지에서 '인턴 있음' 수정 후 분석 -> 'B 대기업 루트'로 변경되는 시각적 효과 극대화.
3. **캐싱 전략:** 동일 스펙으로 반복 요청 시 API 호출 없이 `analysis_history`의 데이터를 반환하여 응답 속도 확보.
