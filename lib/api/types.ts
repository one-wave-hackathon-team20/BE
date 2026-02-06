// API Response Types
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
}

// Auth Types
export interface AuthRequest {
  email: string;
  password: string;
  nickname?: string; // 회원가입 시에만 사용
}

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

// User Types
export type Job = "FRONTEND" | "BACKEND";
export type Background = "MAJOR" | "NON_MAJOR";

export interface UserOnboardingRequest {
  job: Job;
  background: Background;
  companySizes?: string[];
  skills?: string[];
  projects: number;
  intern?: boolean;
  bootcamp?: boolean;
  awards?: boolean;
}

export interface UserUpdateRequest {
  job?: Job;
  background?: Background;
  companySizes?: string[];
  skills?: string[];
  projects?: number;
  intern?: boolean;
  bootcamp?: boolean;
  awards?: boolean;
  nickname?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  nickname: string;
  onboardingCompleted: boolean;
  userDetails?: UserDetailsDto;
}

export interface UserDetailsDto {
  id: number;
  job: Job;
  background: Background;
  companySizes: string[];
  skills: string[];
  projects: number;
  intern: boolean;
  bootcamp: boolean;
  awards: boolean;
}

// Route Types
export interface RouteResponse {
  id: number;
  job: Job;
  background: Background;
  finalCompanySize: string;
  skills: string[];
  projects: number;
  intern: boolean;
  bootcamp: boolean;
  awards: boolean;
  summary: string;
  routeSteps: RouteStepResponse[];
}

export interface RouteStepResponse {
  id: number;
  stepOrder: number;
  title: string;
  description: string;
  duration: string;
  tips: string;
}

// Analysis Types
export interface AnalysisResponse {
  id: number;
  matchedRouteId: number;
  similarity: number;
  reason: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  createdAt: string;
}
