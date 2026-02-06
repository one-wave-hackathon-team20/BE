"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  type SuccessRoute,
  type RouteStep,
  BACKGROUND_LABELS,
  COMPANY_SIZE_LABELS,
} from "@/lib/data";
import { Clock, Lightbulb, Info, ChevronRight } from "lucide-react";

interface RouteTimelineProps {
  route: SuccessRoute;
  isRecommended?: boolean;
}

export function RouteTimeline({
  route,
  isRecommended = false,
}: RouteTimelineProps) {
  const [selectedStep, setSelectedStep] = useState<RouteStep | null>(null);

  return (
    <>
      <Card
        className={cn(
          "border-border/60 transition-all",
          isRecommended && "border-primary/40 ring-2 ring-primary/10"
        )}
      >
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {isRecommended && (
                <Badge className="mb-2 bg-primary text-primary-foreground">
                  AI 추천
                </Badge>
              )}
              <CardTitle className="text-xl">
                {BACKGROUND_LABELS[route.background]}
                {" → "}
                {COMPANY_SIZE_LABELS[route.companySize]} 합격 루트
              </CardTitle>
              <CardDescription className="mt-1">
                {route.job === "frontend" ? "Frontend" : "Backend"} /{" "}
                {route.skills.join(", ")}
              </CardDescription>
            </div>
            {route.matchScore && (
              <div className="flex flex-col items-center rounded-xl bg-primary/10 px-4 py-2">
                <span className="text-2xl font-bold text-primary">
                  {route.matchScore}%
                </span>
                <span className="text-xs text-muted-foreground">유사도</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Timeline */}
          <div className="relative">
            {route.route.map((step, index) => {
              const isFirst = index === 0;
              const isLast = index === route.route.length - 1;

              return (
                <div key={`${route.id}-step-${index}`} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-[15px] top-[32px] h-[calc(100%-16px)] w-px bg-border" />
                  )}

                  {/* Node */}
                  <div
                    className={cn(
                      "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      isFirst
                        ? "bg-accent text-accent-foreground"
                        : isLast
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Content */}
                  <button
                    type="button"
                    onClick={() => setSelectedStep(step)}
                    className={cn(
                      "group flex flex-1 items-center justify-between rounded-xl border border-border/60 bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
                      isLast && "border-primary/20 bg-primary/5"
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{step.step}</h4>
                        {step.duration && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {step.duration}
                          </span>
                        )}
                        {step.detail && (
                          <Badge variant="secondary" className="text-xs">
                            {step.detail}
                          </Badge>
                        )}
                      </div>
                      {step.description && (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* AI Reason */}
          {route.aiReason && (
            <div className="mt-6 rounded-xl bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                <Lightbulb className="h-4 w-4" />
                AI 분석 이유
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {route.aiReason}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step Detail Dialog */}
      <Dialog
        open={selectedStep !== null}
        onOpenChange={() => setSelectedStep(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              {selectedStep?.step}
            </DialogTitle>
            {selectedStep?.duration && (
              <DialogDescription className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                소요 기간: {selectedStep.duration}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-4">
            {selectedStep?.detail && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  상세
                </p>
                <p className="mt-1">{selectedStep.detail}</p>
              </div>
            )}
            {selectedStep?.description && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  설명
                </p>
                <p className="mt-1 leading-relaxed">
                  {selectedStep.description}
                </p>
              </div>
            )}
            {selectedStep?.tip && (
              <div className="rounded-xl bg-accent/10 p-4">
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-accent">
                  <Lightbulb className="h-4 w-4" />
                  TIP
                </p>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {selectedStep.tip}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
