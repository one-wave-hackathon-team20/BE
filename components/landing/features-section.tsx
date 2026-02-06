import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Route, Brain, BarChart3, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Route,
    title: "합격 동아줄 시각화",
    description:
      "합격자의 준비 과정을 단계별 타임라인으로 시각화하여, 성공까지의 여정을 한눈에 파악할 수 있습니다.",
  },
  {
    icon: Brain,
    title: "AI 기반 유사도 분석",
    description:
      "나의 스펙과 합격자 데이터를 AI가 비교 분석하여, 가장 유사한 합격 동아줄을 자동으로 추천해드립니다.",
  },
  {
    icon: BarChart3,
    title: "데이터 기반 인사이트",
    description:
      "단순한 조언이 아닌, 실제 합격 사례에 기반한 데이터로 현실적인 취업 전략을 수립할 수 있습니다.",
  },
  {
    icon: RefreshCw,
    title: "실시간 결과 변화",
    description:
      "스펙을 수정할 때마다 추천 루트가 실시간으로 변경되어, 다양한 시나리오를 탐색할 수 있습니다.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
          Features
        </p>
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          조언이 아닌, 실제 합격 데이터
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
          기존 취업 서비스가 알려주지 않는 것, 바로 합격까지의 과정입니다.
          동아줄은 결과가 아닌 여정에 집중합니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="group border-border/60 transition-all hover:border-primary/30 hover:shadow-lg"
          >
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
