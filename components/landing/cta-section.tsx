import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-center md:px-16">
        {/* Background accent */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            나만의 합격 동아줄을 찾아보세요
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-lg leading-relaxed text-primary-foreground/60">
            지금 바로 내 정보를 입력하고, AI가 분석한 맞춤 합격 동아줄을
            확인해보세요. 완전 무료입니다.
          </p>
          <Button
            size="lg"
            className="mt-8 gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/onboarding">
              지금 시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
