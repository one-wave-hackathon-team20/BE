# 📋 취업난 합격자 루트 맵 — API 명세서 (MVP)

> **Base URL:** `/api/v1`
> **Response Format:** `ApiResponse<T>` (`isSuccess`, `code`, `message`, `data`)

---

## 📌 목차

1. [공통 응답 형식](#1-공통-응답-형식)
2. [에러 코드 정의](#2-에러-코드-정의)
3. [Auth API — 인증](#3-auth-api--인증)
4. [User API — 사용자 정보](#4-user-api--사용자-정보)
5. [Route API — 합격자 루트](#5-route-api--합격자-루트)
6. [Analysis API — AI 분석](#6-analysis-api--ai-분석)

---

## 1. 공통 응답 형식

### 성공 응답

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "요청이 성공했습니다.",
  "data": { ... }
}
```

### 실패 응답

```json
{
  "isSuccess": false,
  "code": "U001",
  "message": "사용자를 찾을 수 없습니다.",
  "data": null
}
```

---

## 2. 에러 코드 정의

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| **Common** | | |
| C001 | 500 | 서버 내부 오류 |
| C002 | 400 | 잘못된 입력값 |
| C003 | 405 | 허용되지 않은 메서드 |
| C004 | 400 | 잘못된 타입 |
| **Auth** | | |
| A001 | 400 | 이미 존재하는 이메일 |
| A002 | 401 | 이메일 또는 비밀번호 불일치 |
| A003 | 401 | 유효하지 않은 토큰 |
| A004 | 401 | 만료된 토큰 |
| **User** | | |
| U001 | 404 | 사용자를 찾을 수 없음 |
| U002 | 400 | 잘못된 사용자 ID 형식 |
| U003 | 403 | 접근 권한 없음 |
| **Route** | | |
| R001 | 404 | 합격자 루트를 찾을 수 없음 |
| **AI** | | |
| AI001 | 500 | Gemini API 호출 실패 |
| AI002 | 400 | 분석에 필요한 사용자 정보 부족 |

---

## 3. Auth API — 인증

### 3-1. 회원가입

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/signup` |
| **Description** | 신규 사용자 회원가입 |
| **Auth** | 불필요 |

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "password123!",
  "nickname": "취준생1"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | String | ✅ | 이메일 (unique) |
| password | String | ✅ | 비밀번호 (8자 이상, 특수문자 포함) |
| nickname | String | ✅ | 닉네임 (2~20자) |

**Response (201 Created)**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "nickname": "취준생1"
  }
}
```

**Error Cases**

| 상황 | 에러 코드 |
|------|-----------|
| 이메일 중복 | A001 |
| 입력값 유효성 실패 | C002 |

---

### 3-2. 로그인

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/login` |
| **Description** | 로그인 후 JWT 토큰 발급 |
| **Auth** | 불필요 |

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "password123!"
}
```

**Response (200 OK)**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "로그인에 성공했습니다.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

**Error Cases**

| 상황 | 에러 코드 |
|------|-----------|
| 이메일/비밀번호 불일치 | A002 |

---

### 3-3. 토큰 재발급

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/reissue` |
| **Description** | Access Token 재발급 |
| **Auth** | 불필요 (Refresh Token 사용) |

**Request Body**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

**Response (200 OK)**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "토큰이 재발급되었습니다.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

**Error Cases**

| 상황 | 에러 코드 |
|------|-----------|
| 유효하지 않은 토큰 | A003 |
| 만료된 토큰 | A004 |

---

## 4. User API — 사용자 정보

> 모든 User API는 `Authorization: Bearer {accessToken}` 헤더 필수

### 4-1. 온보딩 정보 입력

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/v1/users/me/onboarding` |
| **Description** | 회원가입 후 취업 관련 정보 입력 (최초 1회) |
| **Auth** | Bearer Token |

**Request Body**

```json
{
  "job": "FRONTEND",
  "background": "NON_MAJOR",
  "companySizes": ["STARTUP", "SME"],
  "skills": ["react", "nextjs", "typescript"],
  "projects": 2,
  "intern": false,
  "bootcamp": true,
  "awards": false
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| job | String (Enum) | ✅ | 희망 직무: `FRONTEND`, `BACKEND` |
| background | String (Enum) | ✅ | 전공 여부: `MAJOR`, `NON_MAJOR` |
| companySizes | String[] (Enum) | ✅ | 희망 기업 규모 (다중 선택): `STARTUP`, `SME`, `MIDSIZE`, `ENTERPRISE` |
| skills | String[] | ✅ | 기술 스택 (1개 이상) |
| projects | Integer | ❌ | 프로젝트 경험 수 (기본값: 0) |
| intern | Boolean | ❌ | 인턴 경험 여부 (기본값: false) |
| bootcamp | Boolean | ❌ | 부트캠프 경험 여부 (기본값: false) |
| awards | Boolean | ❌ | 수상 경력 여부 (기본값: false) |

**Response (201 Created)**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "온보딩 정보가 저장되었습니다.",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "job": "FRONTEND",
    "background": "NON_MAJOR",
    "companySizes": ["STARTUP", "SME"],
    "skills": ["react", "nextjs", "typescript"],
    "projects": 2,
    "intern": false,
    "bootcamp": true,
    "awards": false,
    "onboardingCompleted": true
  }
}
```

**Error Cases**

| 상황 | 에러 코드 |
|------|-----------|
| 필수값 누락 / 유효성 실패 | C002 |
| skills가 빈 배열 | C002 |

---

### 4-2. 내 정보 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/v1/users/me` |
| **Description** | 로그인한 사용자의 전체 정보 조회 |
| **Auth** | Bearer Token |

**Response (200 OK)**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "요청이 성공했습니다.",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "nickname": "취준생1",
    "job": "FRONTEND",
    "background": "NON_MAJOR",
    "companySizes": ["STARTUP", "SME"],
    "skills": ["react", "nextjs", "typescript"],
    "projects": 2,
    "intern": false,
    "bootcamp": true,
    "awards": false,
    "onboardingCompleted": true,
    "createdAt": "2026-02-06T15:00:00"
  }
}
```

---

### 4-3. 내 정보 수정

| 항목 | 내용 |
|------|------|
| **Method** | `PATCH` |
| **URL** | `/api/v1/users/me` |
| **Description** | 사용자 취업 관련 정보 수정 (변경할 필드만 전송) |
| **Auth** | Bearer Token |

**Request Body** (변경할 필드만 포함)

```json
{
  "intern": true,
  "companySizes": ["STARTUP", "SME", "ENTERPRISE"],
  "skills": ["react", "nextjs", "typescript", "tailwind"]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| job | String (Enum) | ❌ | 희망 직무 |
| background | String (Enum) | ❌ | 전공 여부 |
| companySizes | String[] (Enum) | ❌ | 희망 기업 규모 |
| skills | String[] | ❌ | 기술 스택 |
| projects | Integer | ❌ | 프로젝트 경험 수 |
| intern | Boolean | ❌ | 인턴 경험 여부 |
| bootcamp | Boolean | ❌ | 부트캠프 경험 여부 |
| awards | Boolean | ❌ | 수상 경력 여부 |

**Response (200 OK)**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "정보가 수정되었습니다.",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "job": "FRONTEND",
    "background": "NON_MAJOR",
    "companySizes": ["STARTUP", "SME", "ENTERPRISE"],
    "skills": ["react", "nextjs", "typescript", "tailwind"],
    "projects": 2,
    "intern": true,
    "bootcamp": true,
    "awards": false
  }
}
```

---

## 5. Route API — 합격자 루트

> 모든 Route API는 `Authorization: Bearer {accessToken}` 헤더 필수

### 5-1. 합격자 루트 목록 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/v1/routes` |
| **Description** | 합격자 루트 목록 조회 (필터링/페이지네이션 지원) |
| **Auth** | Bearer Token |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| job | String | ❌ | 직무 필터: `FRONTEND`, `BACKEND` |
| background | String | ❌ | 전공 필터: `MAJOR`, `NON_MAJOR` |
| companySize | String | ❌ | 기업 규모 필터 |
| page | Integer | ❌ | 페이지 번호 (기본값: 0) |
| size | Integer | ❌ | 페이지 크기 (기본값: 10) |

**Example:** `GET /api/v1/routes?job=FRONTEND&background=NON_MAJOR&page=0&size=10`

**Response (200 OK)**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "요청이 성공했습니다.",
  "data": {
    "content": [
      {
        "routeId": 1,
        "job": "FRONTEND",
        "background": "NON_MAJOR",
        "finalCompanySize": "MIDSIZE",
        "summary": "비전공 → 독학 6개월 → 포트폴리오 2개 → 중소기업 합격 → 중견기업 이직",
        "totalSteps": 5,
        "createdAt": "2026-01-15T10:00:00"
      },
      {
        "routeId": 2,
        "job": "FRONTEND",
        "background": "NON_MAJOR",
        "finalCompanySize": "SME",
        "summary": "비전공 → 부트캠프 3개월 → 팀 프로젝트 1개 → 중소기업 합격",
        "totalSteps": 4,
        "createdAt": "2026-01-20T14:30:00"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 25,
    "totalPages": 3
  }
}
```

---

### 5-2. 합격자 루트 상세 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/v1/routes/{routeId}` |
| **Description** | 특정 합격자 루트의 전체 단계 상세 조회 |
| **Auth** | Bearer Token |

**Path Parameters**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| routeId | Long | 합격자 루트 ID |

**Response (200 OK)**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "요청이 성공했습니다.",
  "data": {
    "routeId": 1,
    "job": "FRONTEND",
    "background": "NON_MAJOR",
    "finalCompanySize": "MIDSIZE",
    "skills": ["react", "javascript", "css"],
    "steps": [
      {
        "stepId": 1,
        "order": 1,
        "title": "비전공 출발",
        "description": "경영학과 졸업 후 개발 전향 결심",
        "duration": null,
        "tips": "비전공이라도 CS 기초는 반드시 학습할 것"
      },
      {
        "stepId": 2,
        "order": 2,
        "title": "독학",
        "description": "온라인 강의 + 공식 문서 위주 학습",
        "duration": "6개월",
        "tips": "처음부터 프레임워크 말고 JS 기초부터"
      },
      {
        "stepId": 3,
        "order": 3,
        "title": "포트폴리오 제작",
        "description": "개인 프로젝트 2개 완성",
        "duration": "2개월",
        "tips": "실사용 가능한 서비스 수준으로 제작"
      },
      {
        "stepId": 4,
        "order": 4,
        "title": "중소기업 합격",
        "description": "첫 취업 성공, 실무 경험 축적",
        "duration": "1년",
        "tips": "이직 준비를 병행하며 실무 역량 키울 것"
      },
      {
        "stepId": 5,
        "order": 5,
        "title": "중견기업 이직",
        "description": "포트폴리오 + 실무 경력으로 이직 성공",
        "duration": null,
        "tips": "면접에서 실무 경험 위주로 어필"
      }
    ],
    "keyFactors": ["꾸준한 독학", "실전형 포트폴리오", "실무 경험 활용"],
    "createdAt": "2026-01-15T10:00:00"
  }
}
```

**Error Cases**

| 상황 | 에러 코드 |
|------|-----------|
| 존재하지 않는 routeId | R001 |

---

## 6. Analysis API — AI 분석

> 모든 Analysis API는 `Authorization: Bearer {accessToken}` 헤더 필수

### 6-1. AI 유사 합격자 분석 요청

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **URL** | `/api/v1/analysis` |
| **Description** | 사용자 정보 기반으로 Gemini API를 활용한 유사 합격 루트 분석 |
| **Auth** | Bearer Token |

**Request Body:** 없음 (로그인한 사용자 정보를 서버에서 자동 조회)

**Response (200 OK)**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "AI 분석이 완료되었습니다.",
  "data": {
    "analysisId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "matchedRoutes": [
      {
        "routeId": 1,
        "similarity": 87.5,
        "summary": "비전공 → 독학 6개월 → 포트폴리오 2개 → 중소기업 합격 → 중견기업 이직",
        "job": "FRONTEND",
        "finalCompanySize": "MIDSIZE"
      },
      {
        "routeId": 5,
        "similarity": 72.3,
        "summary": "비전공 → 부트캠프 → 팀 프로젝트 3개 → 스타트업 합격",
        "job": "FRONTEND",
        "finalCompanySize": "STARTUP"
      },
      {
        "routeId": 12,
        "similarity": 65.1,
        "summary": "비전공 → 독학 1년 → 오픈소스 기여 → 중소기업 합격",
        "job": "FRONTEND",
        "finalCompanySize": "SME"
      }
    ],
    "aiInsight": {
      "reason": "비전공 + React 기반 프론트엔드 지망이라는 점에서 루트 #1과 가장 유사합니다. 부트캠프 경험이 있어 독학 기간이 단축될 가능성이 높습니다.",
      "strengths": [
        "React/Next.js/TypeScript 스택이 현재 수요가 높음",
        "부트캠프 경험으로 협업 역량 입증 가능"
      ],
      "weaknesses": [
        "인턴 경험 부재로 대기업 지원 시 불리",
        "프로젝트 수(2개)가 다소 부족"
      ],
      "recommendations": [
        "실서비스 수준의 프로젝트 1개 추가 권장",
        "인턴 경험 또는 오픈소스 기여로 실무 역량 보완",
        "기술 블로그 운영으로 학습 과정 기록"
      ]
    },
    "analyzedAt": "2026-02-06T15:30:00"
  }
}
```

**Error Cases**

| 상황 | 에러 코드 |
|------|-----------|
| 온보딩 미완료 (사용자 정보 부족) | AI002 |
| Gemini API 호출 실패 | AI001 |

---

### 6-2. 최근 분석 결과 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/v1/analysis/latest` |
| **Description** | 가장 최근 AI 분석 결과 조회 (캐시된 결과) |
| **Auth** | Bearer Token |

**Response (200 OK)**

> 6-1의 응답과 동일한 구조

**Error Cases**

| 상황 | 에러 코드 |
|------|-----------|
| 분석 이력 없음 | AI002 |

---

### 6-3. 분석 이력 목록 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **URL** | `/api/v1/analysis` |
| **Description** | 과거 AI 분석 결과 목록 조회 (정보 수정 후 재분석 비교용) |
| **Auth** | Bearer Token |

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| page | Integer | ❌ | 페이지 번호 (기본값: 0) |
| size | Integer | ❌ | 페이지 크기 (기본값: 5) |

**Response (200 OK)**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "요청이 성공했습니다.",
  "data": {
    "content": [
      {
        "analysisId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "topMatchSummary": "비전공 → 독학 6개월 → 포트폴리오 2개 → 중소기업 합격 → 중견기업 이직",
        "topSimilarity": 87.5,
        "analyzedAt": "2026-02-06T15:30:00"
      },
      {
        "analysisId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "topMatchSummary": "비전공 → 부트캠프 → 팀 프로젝트 3개 → 대기업 합격",
        "topSimilarity": 91.2,
        "analyzedAt": "2026-02-06T16:00:00"
      }
    ],
    "page": 0,
    "size": 5,
    "totalElements": 2,
    "totalPages": 1
  }
}
```

---

## 📎 Enum 정의

### Job (직무)
| 값 | 설명 |
|----|------|
| `FRONTEND` | 프론트엔드 |
| `BACKEND` | 백엔드 |

### Background (전공 여부)
| 값 | 설명 |
|----|------|
| `MAJOR` | 전공 |
| `NON_MAJOR` | 비전공 |

### CompanySize (기업 규모)
| 값 | 설명 |
|----|------|
| `STARTUP` | 스타트업 |
| `SME` | 중소기업 |
| `MIDSIZE` | 중견기업 |
| `ENTERPRISE` | 대기업 |

---

## 📎 API 엔드포인트 요약

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| `POST` | `/api/v1/auth/signup` | 회원가입 | ❌ |
| `POST` | `/api/v1/auth/login` | 로그인 | ❌ |
| `POST` | `/api/v1/auth/reissue` | 토큰 재발급 | ❌ |
| `POST` | `/api/v1/users/me/onboarding` | 온보딩 정보 입력 | ✅ |
| `GET` | `/api/v1/users/me` | 내 정보 조회 | ✅ |
| `PATCH` | `/api/v1/users/me` | 내 정보 수정 | ✅ |
| `GET` | `/api/v1/routes` | 합격자 루트 목록 | ✅ |
| `GET` | `/api/v1/routes/{routeId}` | 합격자 루트 상세 | ✅ |
| `POST` | `/api/v1/analysis` | AI 분석 요청 | ✅ |
| `GET` | `/api/v1/analysis/latest` | 최근 분석 결과 | ✅ |
| `GET` | `/api/v1/analysis` | 분석 이력 목록 | ✅ |

**총 11개 엔드포인트**
