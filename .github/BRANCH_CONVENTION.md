## 브랜치 네이밍 가이드

### 기본 구조
`<타입>/<이슈번호>-<간단한-설명>`

예시:
- `feature/123-user-login`
- `fix/456-login-error`
- `refactor/789-auth-module`

---

### <타입> 리스트
- **feature**   : 새로운 기능 개발
- **fix**       : 버그 수정
- **refactor**  : 리팩토링
- **hotfix**    : 긴급 수정 (main/production에서 직접)
- **docs**      : 문서 작업
- **test**      : 테스트 코드 추가/수정
- **chore**     : 빌드 업무 수정, 패키지 매니저 설정 등

---

### 작성 규칙
- 브랜치명은 소문자로 작성
- 단어 구분은 하이픈(-) 사용
- 이슈 번호는 선택사항이지만 권장
- 브랜치명은 간결하고 명확하게 작성
- 특수문자(.,!? 등) 사용 금지

---

### 브랜치 전략

#### 메인 브랜치
- **main**      : 프로덕션 배포용 (보호 브랜치)
- **develop**   : 개발 통합 브랜치 (선택사항)

#### 작업 브랜치
- 위 네이밍 규칙을 따르는 기능별 브랜치
- 작업 완료 후 PR을 통해 main에 병합
- PR 병합 후 해당 브랜치는 삭제

---

### 브랜치 생성 예시
```bash
# 기능 개발
git checkout -b feature/123-user-authentication

# 버그 수정
git checkout -b fix/456-login-validation-error

# 리팩토링
git checkout -b refactor/789-api-structure

# 문서 작업
git checkout -b docs/update-readme
```

---

### 주의사항
- main 브랜치에 직접 커밋하지 않기
- 작업 브랜치에서만 개발 진행
- PR 승인 후 브랜치 삭제하기
- 브랜치명에 이슈 번호 포함 시 이슈 추적 용이
