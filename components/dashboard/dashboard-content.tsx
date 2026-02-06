"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserSummaryCard } from "./user-summary-card";
import { RouteTimeline } from "./route-timeline";
import { AIAnalysisSection } from "./ai-analysis-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  type UserProfile,
  type SuccessRoute,
  DEFAULT_USER,
} from "@/lib/data";
import { convertJobFromApi, convertBackgroundFromApi } from "@/lib/api/converters";
import { Sparkles } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { convertRouteFromApi } from "@/lib/api/converters";
import type { AnalysisResponse, RouteResponse } from "@/lib/api/types";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export function DashboardContent() {
  const router = useRouter();
  const { isAuthenticated, user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [sortedRoutes, setSortedRoutes] = useState<SuccessRoute[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Get user info
        const userResponse = await apiClient.getMyInfo();
        if (!userResponse.isSuccess || !userResponse.data) {
          throw new Error("사용자 정보를 불러올 수 없습니다.");
        }

        const userData = userResponse.data;
        
        // Convert API user to frontend user profile
        if (userData.userDetails) {
          setUser({
            userId: userData.id,
            name: userData.nickname,
            job: convertJobFromApi(userData.userDetails.job),
            background: convertBackgroundFromApi(userData.userDetails.background),
            companySizes: (userData.userDetails.companySizes || []) as CompanySize[],
            skills: userData.userDetails.skills || [],
            projects: userData.userDetails.projects || 0,
            intern: userData.userDetails.intern || false,
            bootcamp: userData.userDetails.bootcamp || false,
            awards: userData.userDetails.awards || false,
          });
        }

        // 2. Check if onboarding is completed
        if (!userData.onboardingCompleted) {
          router.push("/onboarding");
          return;
        }

        // 3. Get or trigger analysis
        let analysisData: AnalysisResponse | null = null;
        try {
          const analysisResponse = await apiClient.getLatestAnalysis();
          if (analysisResponse.isSuccess && analysisResponse.data) {
            analysisData = analysisResponse.data;
          }
        } catch {
          // If no analysis exists, trigger new one
          try {
            const newAnalysisResponse = await apiClient.analyze();
            if (newAnalysisResponse.isSuccess && newAnalysisResponse.data) {
              analysisData = newAnalysisResponse.data;
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류";
            console.error("Analysis failed:", err);
            console.error("Error details:", {
              message: errorMessage,
              error: err,
            });
            
            // 합격 사례가 없는 경우 특별 처리
            if (errorMessage.includes("합격 사례를 찾을 수 없습니다") || 
                errorMessage.includes("ROUTE_NOT_FOUND") ||
                errorMessage.includes("분석할 합격 사례가 없습니다")) {
              toast.warning("분석할 합격 사례가 없습니다. 데이터베이스를 확인해주세요.");
              // Routes만이라도 표시 시도 (필터 없이 모든 routes 조회)
              try {
                const routesResponse = await apiClient.getRoutes();
                if (routesResponse.isSuccess && routesResponse.data && routesResponse.data.length > 0) {
                  const routes = routesResponse.data.map(convertRouteFromApi);
                  setSortedRoutes(routes);
                  toast.info(`${routes.length}개의 합격 동아줄을 찾았습니다. (분석 없이 표시)`);
                }
              } catch (routeErr) {
                console.error("Failed to load routes as fallback:", routeErr);
              }
            } else {
              toast.error(`분석 실패: ${errorMessage}`);
            }
          }
        }

        if (analysisData) {
          setAnalysis(analysisData);
          
          // 4. Get matched route
          const routeResponse = await apiClient.getRouteById(analysisData.matchedRouteId);
          if (routeResponse.isSuccess && routeResponse.data) {
            const matchedRoute = convertRouteFromApi(routeResponse.data, analysisData);
            
            // 5. Get all routes for comparison (필터 없이 모든 routes 조회)
            const allRoutesResponse = await apiClient.getRoutes();
            
            if (allRoutesResponse.isSuccess && allRoutesResponse.data) {
              const allRoutes = allRoutesResponse.data.map((r) => {
                // Use analysis data for matched route
                if (r.id === analysisData.matchedRouteId) {
                  return convertRouteFromApi(r, analysisData);
                }
                return convertRouteFromApi(r);
              });
              
              // Sort by match score (matched route first)
              const sorted = allRoutes.sort((a, b) => {
                if (a.id === matchedRoute.id) return -1;
                if (b.id === matchedRoute.id) return 1;
                return (b.matchScore ?? 0) - (a.matchScore ?? 0);
              });
              
              setSortedRoutes(sorted);
            } else {
              // Fallback: just show matched route
              setSortedRoutes([matchedRoute]);
            }
          }
        } else {
          // No analysis available, just show routes (필터 없이 모든 routes 조회)
          try {
            const routesResponse = await apiClient.getRoutes();
            
            if (routesResponse.isSuccess && routesResponse.data && routesResponse.data.length > 0) {
              const routes = routesResponse.data.map(convertRouteFromApi);
              setSortedRoutes(routes);
            } else {
              // Routes가 없는 경우
              toast.warning("현재 표시할 합격 동아줄이 없습니다.");
              setSortedRoutes([]);
            }
          } catch (err) {
            console.error("Failed to load routes:", err);
            toast.error("합격 동아줄을 불러올 수 없습니다.");
            setSortedRoutes([]);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError(err instanceof Error ? err.message : "대시보드를 불러올 수 없습니다.");
        toast.error("대시보드를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated, router]);

  const topRoute = sortedRoutes[0];

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()}>다시 시도</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-secondary border-t-primary" />
          <Sparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-semibold">AI가 합격 동아줄을 분석하고 있습니다</p>
          <p className="text-sm text-muted-foreground">
            나와 가장 유사한 합격자를 찾고 있어요...
          </p>
        </div>
      </div>
    );
  }

  // Routes가 없는 경우
  if (sortedRoutes.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            합격 동아줄 분석 결과
          </h1>
          <p className="mt-2 text-muted-foreground">
            AI가 분석한 나와 가장 유사한 합격자들의 준비 과정입니다.
          </p>
        </div>

        <div className="mb-8">
          <UserSummaryCard user={user} />
        </div>

        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">분석할 합격 사례가 없습니다</h3>
            <p className="mb-6 text-center text-muted-foreground">
              현재 데이터베이스에 합격 사례 데이터가 없습니다.
              <br />
              관리자에게 문의하거나 잠시 후 다시 시도해주세요.
            </p>
            <Button onClick={() => window.location.reload()}>
              새로고침
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          합격 루트 분석 결과
        </h1>
        <p className="mt-2 text-muted-foreground">
          AI가 분석한 나와 가장 유사한 합격자들의 준비 과정입니다.
        </p>
      </div>

      {/* User Summary */}
      <div className="mb-8">
        <UserSummaryCard user={user} />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Routes - 2 columns */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="recommended">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="recommended">AI 추천 동아줄</TabsTrigger>
              <TabsTrigger value="all">전체 동아줄</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-6">
              {topRoute && (
                <RouteTimeline route={topRoute} isRecommended />
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-6">
              {sortedRoutes.map((route) => (
                <RouteTimeline
                  key={route.id}
                  route={route}
                  isRecommended={route.id === topRoute?.id}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Analysis Sidebar */}
        <div className="space-y-6">
          <AIAnalysisSection
            matchScore={analysis?.similarity ?? topRoute?.matchScore ?? 0}
            skills={user.skills}
            hasIntern={user.intern}
            hasBootcamp={user.bootcamp}
            hasAwards={user.awards}
            projectCount={user.projects}
            analysis={analysis}
          />
        </div>
      </div>
    </div>
  );
}
