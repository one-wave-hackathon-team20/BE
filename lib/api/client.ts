import type {
  ApiResponse,
  AuthRequest,
  AuthResponse,
  UserOnboardingRequest,
  UserUpdateRequest,
  UserResponse,
  RouteResponse,
  AnalysisResponse,
  Job,
  Background,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const error = await response.json();
        // BE의 ApiResponse 형식에 맞춰 에러 메시지 추출
        if (error.message) {
          errorMessage = error.message;
        } else if (error.data?.message) {
          errorMessage = error.data.message;
        }
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  private clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  }

  // Auth API
  async signup(request: AuthRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify(request),
    });
    if (response.isSuccess && response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
      localStorage.setItem("userId", response.data.userId);
    }
    return response;
  }

  async login(request: AuthRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(request),
    });
    if (response.isSuccess && response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
      localStorage.setItem("userId", response.data.userId);
    }
    return response;
  }

  logout(): void {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // User API
  async completeOnboarding(
    request: UserOnboardingRequest
  ): Promise<ApiResponse<void>> {
    return this.request<void>("/api/v1/users/me/onboarding", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async updateUser(request: UserUpdateRequest): Promise<ApiResponse<void>> {
    return this.request<void>("/api/v1/users/me", {
      method: "PATCH",
      body: JSON.stringify(request),
    });
  }

  async getMyInfo(): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>("/api/v1/users/me", {
      method: "GET",
    });
  }

  // Route API
  async getRoutes(params?: {
    job?: Job;
    background?: Background;
  }): Promise<ApiResponse<RouteResponse[]>> {
    const queryParams = new URLSearchParams();
    // params가 undefined이거나 빈 객체인 경우 필터 없이 모든 routes 조회
    if (params?.job) queryParams.append("job", params.job);
    if (params?.background) queryParams.append("background", params.background);

    const queryString = queryParams.toString();
    const endpoint = `/api/v1/routes${queryString ? `?${queryString}` : ""}`;

    return this.request<RouteResponse[]>(endpoint, {
      method: "GET",
    });
  }

  async getRouteById(id: number): Promise<ApiResponse<RouteResponse>> {
    return this.request<RouteResponse>(`/api/v1/routes/${id}`, {
      method: "GET",
    });
  }

  // Analysis API
  async analyze(): Promise<ApiResponse<AnalysisResponse>> {
    return this.request<AnalysisResponse>("/api/v1/analysis", {
      method: "POST",
    });
  }

  async getLatestAnalysis(): Promise<ApiResponse<AnalysisResponse>> {
    return this.request<AnalysisResponse>("/api/v1/analysis/latest", {
      method: "GET",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
