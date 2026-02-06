import React from "react"
import type { Metadata } from "next";
import { Noto_Sans_KR, Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";

import "./globals.css";

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "합격자 루트 맵 | 취업 성공의 지도",
  description:
    "실제 합격자들의 준비 과정을 시각화하고, AI 기반으로 나에게 맞는 취업 성공 경로를 추천받으세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
