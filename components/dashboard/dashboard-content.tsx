"use client";

import { useEffect, useState } from "react";
import { UserSummaryCard } from "./user-summary-card";
import { RouteTimeline } from "./route-timeline";
import { AIAnalysisSection } from "./ai-analysis-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type UserProfile,
  type SuccessRoute,
  DEFAULT_USER,
  MOCK_SUCCESS_ROUTES,
} from "@/lib/data";
import { Sparkles } from "lucide-react";

export function DashboardContent() {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [sortedRoutes, setSortedRoutes] = useState<SuccessRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user profile from sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("userProfile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser({ ...DEFAULT_USER, ...parsed });
        } catch {
          // fallback to default
        }
      }
    }

    // Simulate AI analysis delay
    const timer = setTimeout(() => {
      const sorted = [...MOCK_SUCCESS_ROUTES].sort(
        (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)
      );
      setSortedRoutes(sorted);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const topRoute = sortedRoutes[0];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-secondary border-t-primary" />
          <Sparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-semibold">AI가 합격 루트를 분석하고 있습니다</p>
          <p className="text-sm text-muted-foreground">
            나와 가장 유사한 합격자를 찾고 있어요...
          </p>
        </div>
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
              <TabsTrigger value="recommended">AI 추천 루트</TabsTrigger>
              <TabsTrigger value="all">전체 루트</TabsTrigger>
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
            matchScore={topRoute?.matchScore ?? 0}
            skills={user.skills}
            hasIntern={user.intern}
            hasBootcamp={user.bootcamp}
            hasAwards={user.awards}
            projectCount={user.projects}
          />
        </div>
      </div>
    </div>
  );
}
