"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 동아줄 아이콘 컴포넌트 - 꼬인 밧줄 형태
function DongajulIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 동아줄 - 꼬인 밧줄 패턴 */}
      <path
        d="M6 6C8 4 10 6 12 4C14 6 16 4 18 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10C8 8 10 10 12 8C14 10 16 8 18 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 14C8 12 10 14 12 12C14 14 16 12 18 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 18C8 16 10 18 12 16C14 18 16 16 18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/dashboard", label: "합격 동아줄" },
  { href: "/mypage", label: "마이페이지" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  
  // 로딩 중일 때는 기본 UI만 표시 (Hydration 오류 방지)
  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <DongajulIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">동아줄</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <DongajulIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">동아줄</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.nickname || "사용자"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/mypage">마이페이지</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">대시보드</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">회원가입</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-2"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="mt-2" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    로그인
                  </Link>
                </Button>
                <Button size="sm" className="mt-2" asChild>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    회원가입
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
