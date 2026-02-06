import Link from "next/link";

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

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <DongajulIcon className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold">동아줄</span>
        </div>

        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            홈
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            합격 동아줄
          </Link>
          <Link
            href="/mypage"
            className="hover:text-foreground transition-colors"
          >
            마이페이지
          </Link>
        </nav>

        <p className="text-sm text-muted-foreground">
          {"2026 동아줄. All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
