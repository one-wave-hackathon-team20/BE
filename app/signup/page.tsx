"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미 로그인된 경우 대시보드로 리다이렉트 (클라이언트에서만)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이거나 이미 인증된 경우 로딩 표시
  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-primary" />
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(email, password, nickname);
      toast.success("회원가입이 완료되었습니다!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md border-border/60">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
            <CardDescription>
              새 계정을 만들어 합격 동아줄을 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="최소 6자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "가입 중..."
                ) : (
                  <>
                    회원가입
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
