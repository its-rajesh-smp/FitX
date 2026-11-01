"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { DemoChatWindow } from "@/features/landing/components/hero/DemoChatWindow";
import { DemoPlanWindow } from "@/features/landing/components/hero/DemoPlanWindow";
import {
  DEMO_DURATIONS,
  DEMO_STEP,
  DEMO_USER_MESSAGE,
} from "@/features/landing/data/heroDemo";
import { useDemoTimeline } from "@/features/landing/hooks/useDemoTimeline";
import { useTypewriter } from "@/features/landing/hooks/useTypewriter";

export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();

  const timelineStep = useDemoTimeline(DEMO_DURATIONS, inView && !reduceMotion);
  // Reduced motion shows the finished frame instead of the loop.
  const step = reduceMotion ? DEMO_STEP.ready : timelineStep;
  const typed = useTypewriter(DEMO_USER_MESSAGE, step === DEMO_STEP.typing && inView);

  return (
    <div
      ref={ref}
      className="stage-grid relative overflow-hidden rounded-[28px] border border-stage-line p-3 sm:p-6 lg:p-10"
    >
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-accent-deep/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full bg-fuchsia-300/10 blur-3xl" />

      <div
        aria-label="FitX demo: a chat that builds a weekly workout plan"
        role="img"
        className="relative grid grid-cols-1 gap-4 text-left md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
      >
        <DemoChatWindow step={step} typed={typed} />
        <DemoPlanWindow step={step} />
      </div>
    </div>
  );
}
