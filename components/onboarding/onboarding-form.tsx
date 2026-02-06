"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Server,
  GraduationCap,
  BookOpen,
  Building2,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Job,
  type Background,
  type CompanySize,
  COMPANY_SIZE_LABELS,
  SKILL_OPTIONS,
} from "@/lib/data";

const TOTAL_STEPS = 4;

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [job, setJob] = useState<Job | null>(null);
  const [background, setBackground] = useState<Background | null>(null);
  const [companySizes, setCompanySizes] = useState<CompanySize[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState(0);
  const [intern, setIntern] = useState(false);
  const [bootcamp, setBootcamp] = useState(false);
  const [awards, setAwards] = useState(false);

  const progress = (step / TOTAL_STEPS) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return job !== null && background !== null;
      case 2:
        return companySizes.length > 0;
      case 3:
        return skills.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const toggleCompanySize = (size: CompanySize) => {
    setCompanySizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleComplete = () => {
    // In production, this would save to Supabase
    const userData = {
      job,
      background,
      companySizes,
      skills,
      projects,
      intern,
      bootcamp,
      awards,
    };
    // Store in sessionStorage for demo purposes
    if (typeof window !== "undefined") {
      sessionStorage.setItem("userProfile", JSON.stringify(userData));
    }
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {step} / {TOTAL_STEPS} 단계
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step 1: Job & Background */}
      {step === 1 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">직무와 전공을 선택하세요</CardTitle>
            <p className="text-muted-foreground">
              합격자 데이터와 비교 분석을 위한 기본 정보입니다.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Job Selection */}
            <div>
              <label className="mb-3 block text-sm font-semibold">
                희망 직무
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setJob("frontend")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:shadow-md",
                    job === "frontend"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl",
                      job === "frontend"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <Code2 className="h-7 w-7" />
                  </div>
                  <span className="font-semibold">Frontend</span>
                </button>

                <button
                  type="button"
                  onClick={() => setJob("backend")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:shadow-md",
                    job === "backend"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl",
                      job === "backend"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <Server className="h-7 w-7" />
                  </div>
                  <span className="font-semibold">Backend</span>
                </button>
              </div>
            </div>

            {/* Background Selection */}
            <div>
              <label className="mb-3 block text-sm font-semibold">
                전공 여부
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setBackground("major")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:shadow-md",
                    background === "major"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl",
                      background === "major"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <span className="font-semibold">전공자</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBackground("non_major")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:shadow-md",
                    background === "non_major"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl",
                      background === "non_major"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <span className="font-semibold">비전공자</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Company Size */}
      {step === 2 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">
              희망 기업 규모를 선택하세요
            </CardTitle>
            <p className="text-muted-foreground">
              여러 개를 선택할 수 있습니다.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {(
                Object.entries(COMPANY_SIZE_LABELS) as [CompanySize, string][]
              ).map(([key, label]) => {
                const icons: Record<CompanySize, typeof Building2> = {
                  startup: Rocket,
                  sme: Building2,
                  midsize: Building2,
                  enterprise: Building2,
                };
                const Icon = icons[key];
                const isSelected = companySizes.includes(key);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleCompanySize(key)}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:shadow-md",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-xl",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="font-semibold">{label}</span>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Skills */}
      {step === 3 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">
              보유 기술 스택을 선택하세요
            </CardTitle>
            <p className="text-muted-foreground">
              1개 이상 필수로 선택해주세요.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {SKILL_OPTIONS.map((skill) => {
                const isSelected = skills.includes(skill);
                return (
                  <Badge
                    key={skill}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-4 py-2 text-sm transition-all hover:shadow-sm",
                      isSelected
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:border-primary/30 hover:bg-primary/5"
                    )}
                    onClick={() => toggleSkill(skill)}
                  >
                    {isSelected && <Check className="mr-1 h-3 w-3" />}
                    {skill}
                  </Badge>
                );
              })}
            </div>
            {skills.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                {skills.length}개 선택됨
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Additional Info */}
      {step === 4 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">추가 정보를 입력하세요</CardTitle>
            <p className="text-muted-foreground">
              선택 사항이지만, 더 정확한 분석 결과를 받을 수 있습니다.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project count */}
            <div>
              <label className="mb-3 block text-sm font-semibold">
                프로젝트 경험 수
              </label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProjects(Math.max(0, projects - 1))}
                  disabled={projects === 0}
                >
                  -
                </Button>
                <span className="w-12 text-center text-2xl font-bold">
                  {projects}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProjects(projects + 1)}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground">개</span>
              </div>
            </div>

            {/* Toggle options */}
            <div className="space-y-4">
              {[
                {
                  label: "인턴 경험",
                  value: intern,
                  setter: setIntern,
                  desc: "IT 관련 인턴십 경험이 있나요?",
                },
                {
                  label: "부트캠프 경험",
                  value: bootcamp,
                  setter: setBootcamp,
                  desc: "코딩 부트캠프를 수료했나요?",
                },
                {
                  label: "수상 경력",
                  value: awards,
                  setter: setAwards,
                  desc: "대회나 공모전 수상 경력이 있나요?",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => item.setter(!item.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border-2 p-5 text-left transition-all",
                    item.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      item.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    {item.value && <Check className="h-4 w-4" />}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          이전
        </Button>

        {step < TOTAL_STEPS ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="gap-2"
          >
            다음
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleComplete} className="gap-2">
            분석 시작하기
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
