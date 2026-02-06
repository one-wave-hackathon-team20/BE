"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import type { AnalysisResponse } from "@/lib/api/types";

interface AIAnalysisProps {
  matchScore: number;
  skills: string[];
  hasIntern: boolean;
  hasBootcamp: boolean;
  hasAwards: boolean;
  projectCount: number;
  analysis?: AnalysisResponse | null;
}

export function AIAnalysisSection({
  matchScore,
  skills,
  hasIntern,
  hasBootcamp,
  hasAwards,
  projectCount,
  analysis,
}: AIAnalysisProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore((prev) => {
          if (prev >= matchScore) {
            clearInterval(interval);
            return matchScore;
          }
          return prev + 1;
        });
      }, 15);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [matchScore]);

  // Use analysis data if available, otherwise generate insights based on user data
  const strengths: string[] = analysis?.strengths || [];
  const weaknesses: string[] = analysis?.weaknesses || [];
  const recommendations: string[] = analysis?.recommendations || [];

  // Fallback to generated insights if no analysis data
  if (strengths.length === 0) {
    if (skills.length >= 3) strengths.push("다양한 기술 스택 보유");
    if (hasBootcamp) strengths.push("부트캠프 경험으로 체계적 학습 이력");
    if (projectCount >= 2) strengths.push("충분한 프로젝트 경험");
    if (hasIntern) strengths.push("인턴십을 통한 실무 경험");
  }

  if (weaknesses.length === 0) {
    if (!hasIntern) weaknesses.push("인턴 경험 추가 시 대기업 루트 가능성 증가");
    if (projectCount < 2)
      weaknesses.push("포트폴리오 프로젝트 2개 이상 권장");
    if (!hasAwards) weaknesses.push("수상 경력이 있으면 차별점 확보 가능");
    if (skills.length < 3) weaknesses.push("기술 스택 다양화 권장");
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI 분석 결과</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score gauge */}
        <div className="flex items-center gap-6">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                className="stroke-secondary"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                className="stroke-primary transition-all duration-1000"
                strokeWidth="8"
                strokeDasharray={`${animatedScore * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-2xl font-bold">
              {animatedScore}%
            </span>
          </div>
          <div>
            <p className="font-semibold">최고 유사도 매칭</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              수집된 합격자 데이터 중 가장 유사한 루트와의 일치율입니다.
            </p>
          </div>
        </div>

        <Separator />

        {/* Strengths */}
        {strengths.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <p className="text-sm font-semibold">강점</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {strengths.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="bg-accent/10 text-accent"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {weaknesses.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm font-semibold">개선 포인트</p>
            </div>
            <ul className="space-y-2">
              {weaknesses.map((w) => (
                <li
                  key={w}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-600" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">추천 사항</p>
            </div>
            <ul className="space-y-2">
              {recommendations.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
