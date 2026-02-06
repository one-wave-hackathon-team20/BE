import { UserPlus, Search, Map } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "내 정보 입력",
    description:
      "직무, 전공 여부, 희망 기업 규모, 기술 스택 등 나의 현재 상황을 입력합니다.",
  },
  {
    icon: Search,
    number: "02",
    title: "AI 분석 실행",
    description:
      "AI가 합격자 데이터베이스에서 나와 가장 유사한 합격자를 찾아 분석합니다.",
  },
  {
    icon: Map,
    number: "03",
    title: "합격 동아줄 확인",
    description:
      "추천된 합격 동아줄을 시각화된 타임라인으로 확인하고, 각 단계별 상세 정보를 탐색합니다.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-y border-border/60 bg-card py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            3단계로 시작하는 합격 동아줄 탐색
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+48px)] top-10 hidden h-px w-[calc(100%-96px)] bg-border md:block" />
              )}

              {/* Icon */}
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <step.icon className="h-8 w-8" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {step.number}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="max-w-xs text-pretty leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
