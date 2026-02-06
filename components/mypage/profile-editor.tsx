"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Code2,
  Server,
  GraduationCap,
  BookOpen,
  Building2,
  Rocket,
  Check,
  Save,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Job,
  type Background,
  type CompanySize,
  type UserProfile,
  COMPANY_SIZE_LABELS,
  SKILL_OPTIONS,
  DEFAULT_USER,
  JOB_LABELS,
  BACKGROUND_LABELS,
} from "@/lib/data";

export function ProfileEditor() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("userProfile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser({ ...DEFAULT_USER, ...parsed });
        } catch {
          // fallback
        }
      }
    }
  }, []);

  const updateField = <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K]
  ) => {
    setUser((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleCompanySize = (size: CompanySize) => {
    const updated = user.companySizes.includes(size)
      ? user.companySizes.filter((s) => s !== size)
      : [...user.companySizes, size];
    updateField("companySizes", updated);
  };

  const toggleSkill = (skill: string) => {
    const updated = user.skills.includes(skill)
      ? user.skills.filter((s) => s !== skill)
      : [...user.skills, skill];
    updateField("skills", updated);
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("userProfile", JSON.stringify(user));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReanalyze = () => {
    handleSave();
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">마이페이지</h1>
          <p className="mt-2 text-muted-foreground">
            정보를 수정하면 AI 분석 결과가 실시간으로 변경됩니다.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSave} className="gap-2 bg-transparent">
            <Save className="h-4 w-4" />
            {saved ? "저장됨" : "저장"}
          </Button>
          <Button onClick={handleReanalyze} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            재분석
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Job & Background */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>
              직무와 전공 정보는 분석의 핵심 기준이 됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job */}
            <div>
              <label className="mb-3 block text-sm font-semibold">
                희망 직무
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(["frontend", "backend"] as Job[]).map((j) => {
                  const Icon = j === "frontend" ? Code2 : Server;
                  return (
                    <button
                      key={j}
                      type="button"
                      onClick={() => updateField("job", j)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border-2 p-4 transition-all",
                        user.job === j
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          user.job === j
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-semibold">{JOB_LABELS[j]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background */}
            <div>
              <label className="mb-3 block text-sm font-semibold">
                전공 여부
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(["major", "non_major"] as Background[]).map((b) => {
                  const Icon = b === "major" ? GraduationCap : BookOpen;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateField("background", b)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border-2 p-4 transition-all",
                        user.background === b
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          user.background === b
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-semibold">
                        {BACKGROUND_LABELS[b]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Size */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>희망 기업 규모</CardTitle>
            <CardDescription>여러 개를 선택할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(
                Object.entries(COMPANY_SIZE_LABELS) as [CompanySize, string][]
              ).map(([key, label]) => {
                const Icon = key === "startup" ? Rocket : Building2;
                const isSelected = user.companySizes.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleCompanySize(key)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span className="text-sm font-semibold">{label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>기술 스택</CardTitle>
            <CardDescription>
              보유한 기술 스택을 모두 선택하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {SKILL_OPTIONS.map((skill) => {
                const isSelected = user.skills.includes(skill);
                return (
                  <Badge
                    key={skill}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-4 py-2 text-sm transition-all",
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
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>추가 정보</CardTitle>
            <CardDescription>
              경험 정보를 추가하면 더 정확한 분석이 가능합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Projects */}
            <div>
              <label className="mb-3 block text-sm font-semibold">
                프로젝트 수
              </label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateField("projects", Math.max(0, user.projects - 1))
                  }
                  disabled={user.projects === 0}
                >
                  -
                </Button>
                <span className="w-12 text-center text-2xl font-bold">
                  {user.projects}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateField("projects", user.projects + 1)}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground">개</span>
              </div>
            </div>

            <Separator />

            {/* Toggle options */}
            <div className="space-y-4">
              {[
                {
                  key: "intern" as const,
                  label: "인턴 경험",
                  desc: "IT 관련 인턴십 경험",
                },
                {
                  key: "bootcamp" as const,
                  label: "부트캠프 경험",
                  desc: "코딩 부트캠프 수료",
                },
                {
                  key: "awards" as const,
                  label: "수상 경력",
                  desc: "대회/공모전 수상",
                },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => updateField(item.key, !user[item.key])}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all",
                    user[item.key]
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
                      "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                      user[item.key]
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    {user[item.key] && <Check className="h-4 w-4" />}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <div className="flex justify-center gap-4 pb-8">
          <Button variant="outline" onClick={handleSave} className="gap-2 bg-transparent">
            <Save className="h-4 w-4" />
            {saved ? "저장 완료" : "변경사항 저장"}
          </Button>
          <Button onClick={handleReanalyze} className="gap-2">
            변경사항으로 재분석
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
