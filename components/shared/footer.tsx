import { MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold">루트맵</span>
        </div>

        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            홈
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            합격 루트
          </Link>
          <Link
            href="/mypage"
            className="hover:text-foreground transition-colors"
          >
            마이페이지
          </Link>
        </nav>

        <p className="text-sm text-muted-foreground">
          {"2026 루트맵. All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
