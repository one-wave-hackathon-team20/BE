"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import type { UserResponse } from "@/lib/api/types";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 클라이언트에서만 인증 상태 확인
    const checkAuth = async () => {
      const authenticated = apiClient.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const response = await apiClient.getMyInfo();
      if (response.isSuccess && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      apiClient.logout();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password });
    if (response.isSuccess && response.data) {
      setIsAuthenticated(true);
      await refreshUser();
      router.push("/dashboard");
    } else {
      throw new Error(response.message || "로그인에 실패했습니다.");
    }
  };

  const signup = async (email: string, password: string, nickname: string) => {
    const response = await apiClient.signup({ email, password, nickname });
    if (response.isSuccess && response.data) {
      setIsAuthenticated(true);
      await refreshUser();
      router.push("/onboarding");
    } else {
      throw new Error(response.message || "회원가입에 실패했습니다.");
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
