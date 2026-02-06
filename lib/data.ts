// ========== Types ==========
export type Job = "frontend" | "backend";
export type Background = "major" | "non_major";
export type CompanySize = "startup" | "sme" | "midsize" | "enterprise";

export interface UserProfile {
  userId: string;
  name: string;
  job: Job;
  background: Background;
  companySizes: CompanySize[];
  skills: string[];
  projects: number;
  intern: boolean;
  bootcamp: boolean;
  awards: boolean;
}

export interface RouteStep {
  step: string;
  duration?: string;
  detail?: string;
  description?: string;
  tip?: string;
}

export interface SuccessRoute {
  id: string;
  job: Job;
  background: Background;
  companySize: CompanySize;
  skills: string[];
  route: RouteStep[];
  matchScore?: number;
  aiReason?: string;
}

// ========== Labels ==========
export const JOB_LABELS: Record<Job, string> = {
  frontend: "Frontend",
  backend: "Backend",
};

export const BACKGROUND_LABELS: Record<Background, string> = {
  major: "전공자",
  non_major: "비전공자",
};

export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  startup: "스타트업",
  sme: "중소기업",
  midsize: "중견기업",
  enterprise: "대기업",
};

export const SKILL_OPTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Vue.js",
  "Angular",
  "Node.js",
  "Spring Boot",
  "Java",
  "Python",
  "Django",
  "Go",
  "Docker",
  "AWS",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "Tailwind CSS",
];

// ========== Mock Data ==========
export const MOCK_SUCCESS_ROUTES: SuccessRoute[] = [
  {
    id: "route-1",
    job: "frontend",
    background: "non_major",
    companySize: "midsize",
    skills: ["React", "Next.js", "TypeScript"],
    route: [
      {
        step: "비전공 출발",
        description: "경영학과 졸업, 코딩에 대한 흥미로 전환 결심",
        tip: "비전공이라도 논리적 사고력이 있다면 충분히 가능합니다",
      },
      {
        step: "독학 시작",
        duration: "3개월",
        description: "HTML/CSS/JS 기초부터 React까지 독학",
        tip: "무료 강의보다 공식 문서를 먼저 읽는 것을 추천",
      },
      {
        step: "부트캠프 수료",
        duration: "4개월",
        description: "프론트엔드 부트캠프에서 팀 프로젝트 경험",
        tip: "부트캠프 선택 시 수료 후 취업 지원까지 해주는 곳을 추천",
      },
      {
        step: "포트폴리오 제작",
        duration: "2개월",
        detail: "2개 프로젝트",
        description: "개인 프로젝트 2개 완성, GitHub 정리",
        tip: "CRUD보다는 실제 문제를 해결하는 프로젝트가 더 좋은 인상을 줍니다",
      },
      {
        step: "중소기업 입사",
        duration: "1년 근무",
        description: "스타트업에서 프론트엔드 개발자로 실무 경험",
        tip: "첫 회사에서는 연봉보다 성장 환경을 우선시하세요",
      },
      {
        step: "중견기업 이직 성공",
        description: "실무 경험과 포트폴리오를 바탕으로 중견기업 합격",
        tip: "이직 준비 시 현재 회사에서의 성과를 수치화하면 좋습니다",
      },
    ],
    matchScore: 92,
    aiReason:
      "비전공 + 부트캠프 경험 + React/Next.js 스택이 일치하며, 포트폴리오 기반 성장 루트가 사용자의 현재 상황과 매우 유사합니다.",
  },
  {
    id: "route-2",
    job: "frontend",
    background: "major",
    companySize: "enterprise",
    skills: ["React", "TypeScript", "Next.js", "GraphQL"],
    route: [
      {
        step: "컴퓨터공학 전공",
        description: "4년제 대학 컴퓨터공학과 졸업",
        tip: "전공 수업 중 웹 관련 과목을 적극적으로 수강하세요",
      },
      {
        step: "인턴 경험",
        duration: "6개월",
        description: "IT 대기업 프론트엔드 인턴십",
        tip: "인턴 기간 동안 코드 리뷰 문화를 최대한 흡수하세요",
      },
      {
        step: "개인 프로젝트",
        duration: "3개월",
        detail: "3개 프로젝트",
        description: "오픈소스 기여 + 개인 SaaS 프로젝트",
        tip: "GitHub Star를 받은 프로젝트는 면접에서 큰 플러스",
      },
      {
        step: "코딩 테스트 준비",
        duration: "2개월",
        description: "알고리즘 문제 300+ 풀이",
        tip: "프로그래머스 Lv.2까지는 확실히 풀 수 있어야 합니다",
      },
      {
        step: "대기업 합격",
        description: "네카라쿠배 중 1곳 프론트엔드 개발자 합격",
        tip: "기술 면접에서는 '왜'를 설명할 수 있어야 합니다",
      },
    ],
    matchScore: 78,
    aiReason:
      "전공자 루트이지만 기술 스택이 일치합니다. 인턴 경험이 있다면 이 루트와의 유사도가 더 높아집니다.",
  },
  {
    id: "route-3",
    job: "backend",
    background: "non_major",
    companySize: "sme",
    skills: ["Java", "Spring Boot", "MySQL", "Docker"],
    route: [
      {
        step: "타 전공 졸업",
        description: "기계공학 전공, 개발자 전환 결심",
        tip: "이공계 전공의 문제 해결 능력은 개발에서 큰 강점",
      },
      {
        step: "국비지원 교육",
        duration: "6개월",
        description: "Java/Spring 기반 백엔드 국비지원 과정 수료",
        tip: "국비지원 과정에서도 스스로 추가 학습량을 확보하는 것이 중요",
      },
      {
        step: "팀 프로젝트",
        duration: "2개월",
        detail: "1개 프로젝트",
        description: "교육 과정 내 팀 프로젝트로 REST API 서버 구축",
        tip: "팀 프로젝트에서 리더 역할을 맡아보세요",
      },
      {
        step: "중소기업 합격",
        description: "SI 회사 백엔드 개발자로 입사",
        tip: "SI라도 다양한 프로젝트 경험을 쌓을 수 있는 장점이 있습니다",
      },
    ],
    matchScore: 65,
    aiReason:
      "비전공 배경은 일치하지만 직무와 기술 스택이 다릅니다. 백엔드 전환을 고려한다면 참고할 만한 루트입니다.",
  },
  {
    id: "route-4",
    job: "frontend",
    background: "non_major",
    companySize: "startup",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    route: [
      {
        step: "디자인 전공",
        description: "시각디자인과 졸업 후 UI/UX와 ���발 교차점 발견",
        tip: "디자인 감각은 프론트엔드에서 엄청난 차별점이 됩니다",
      },
      {
        step: "온라인 학습",
        duration: "4개월",
        description: "Udemy, 인프런에서 React 집중 학습",
        tip: "강의를 따라하기만 하지 말고 자신만의 변형을 시도하세요",
      },
      {
        step: "사이드 프로젝트",
        duration: "3개월",
        detail: "2개 프로젝트",
        description: "디자인+개발을 결합한 포트폴리오 사이트 제작",
        tip: "디자인과 코드를 함께 보여줄 수 있는 포트폴리오가 강력합니다",
      },
      {
        step: "스타트업 합격",
        description: "초기 스타트업 프론트엔드 개발자 합격",
        tip: "스���트업에서는 빠른 학습력과 다방면 역량을 높이 평가합니다",
      },
    ],
    matchScore: 85,
    aiReason:
      "비전공 + React/TypeScript 스택 일치, 스타트업 희망과 부합합니다. 디자인 배경이 없더라도 유사한 성장 패턴을 보여줍니다.",
  },
];

export const DEFAULT_USER: UserProfile = {
  userId: "user-demo",
  name: "김취준",
  job: "frontend",
  background: "non_major",
  companySizes: ["startup", "sme"],
  skills: ["React", "Next.js", "TypeScript"],
  projects: 2,
  intern: false,
  bootcamp: true,
  awards: false,
};
