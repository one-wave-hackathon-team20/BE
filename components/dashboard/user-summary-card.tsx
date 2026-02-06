"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, User } from "lucide-react";
import {
  type UserProfile,
  JOB_LABELS,
  BACKGROUND_LABELS,
  COMPANY_SIZE_LABELS,
} from "@/lib/data";

interface UserSummaryCardProps {
  user: UserProfile;
}

export function UserSummaryCard({ user }: UserSummaryCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{user.name}님의 프로필</CardTitle>
            <p className="text-sm text-muted-foreground">
              {JOB_LABELS[user.job]} / {BACKGROUND_LABELS[user.background]}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="gap-2" asChild>
          <Link href="/mypage">
            <Settings className="h-4 w-4" />
            수정
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              희망 기업
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.companySizes.map((size) => (
                <Badge key={size} variant="secondary" className="text-xs">
                  {COMPANY_SIZE_LABELS[size]}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              기술 스택
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="border-primary/20 text-xs text-primary"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-6">
            {user.projects > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  프로젝트
                </p>
                <p className="mt-1 text-lg font-bold">{user.projects}개</p>
              </div>
            )}
            {user.intern && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  인턴
                </p>
                <p className="mt-1 text-lg font-bold text-accent">있음</p>
              </div>
            )}
            {user.bootcamp && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  부트캠프
                </p>
                <p className="mt-1 text-lg font-bold text-accent">수료</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
