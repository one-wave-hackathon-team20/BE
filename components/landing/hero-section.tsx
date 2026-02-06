"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-foreground">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI 기반 취업 동아줄 분석
            </span>
          </div>

          {/* Main heading */}
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            합격까지의 여정을
            <br />
            <span className="text-primary">지도</span>로 보여드립니다
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/60 md:text-xl">
            실제 합격자들이 어떤 준비 과정을 거쳐 취업에 성공했는지 시각화하고,
            AI가 나와 가장 유사한 합격 동아줄을 찾아드립니다.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/onboarding">
                무료로 시작하기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-primary-foreground/20 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="/dashboard">합격 동아줄 둘러보기</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-primary-foreground/10 pt-10 md:gap-16">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                <span className="text-2xl font-bold text-primary-foreground md:text-3xl">
                  1,200+
                </span>
              </div>
              <span className="text-sm text-primary-foreground/50">
                합격자 동아줄 수집
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="h-5 w-5" />
                <span className="text-2xl font-bold text-primary-foreground md:text-3xl">
                  50+
                </span>
              </div>
              <span className="text-sm text-primary-foreground/50">
                기업 유형 커버
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                <span className="text-2xl font-bold text-primary-foreground md:text-3xl">
                  89%
                </span>
              </div>
              <span className="text-sm text-primary-foreground/50">
                추천 만족도
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
