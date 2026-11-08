import { useEffect, useMemo, useState } from "react";
import {
  MUSCLE_CHOICES,
  MUSCLE_STARTER,
  PREVIEW_DAYS,
  TIME_CHOICES,
  type Muscle,
} from "@/features/landing/data/landing";
import { useToggleSet } from "@/features/landing/hooks/useToggleSet";

export type SetupStep = "muscles" | "time" | "building" | "ready";

/** Drives the setup demo: pick muscles, pick time, then preview a week. */
export function useSetupDemo() {
  const [step, setStep] = useState<SetupStep>("muscles");
  const [time, setTime] = useState<(typeof TIME_CHOICES)[number]>("30 min");
  const { selected, toggle, reset } = useToggleSet<Muscle>(["Glutes", "Abdominals"]);

  useEffect(() => {
    if (step !== "building") return;
    const timer = setTimeout(() => setStep("ready"), 1400);
    return () => clearTimeout(timer);
  }, [step]);

  const preview = useMemo(() => {
    const ordered = MUSCLE_CHOICES.filter((muscle) => selected.has(muscle));
    return {
      rows: ordered.slice(0, PREVIEW_DAYS.length).map((muscle, index) => ({
        day: PREVIEW_DAYS[index],
        label: `${muscle} focus`,
        detail: `${MUSCLE_STARTER[muscle]} · ${time}`,
      })),
      extra: Math.max(ordered.length - PREVIEW_DAYS.length, 0),
    };
  }, [selected, time]);

  const startOver = () => {
    reset(["Glutes", "Abdominals"]);
    setTime("30 min");
    setStep("muscles");
  };

  return { step, setStep, selected, toggle, time, setTime, preview, startOver };
}
