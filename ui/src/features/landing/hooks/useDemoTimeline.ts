import { useEffect, useState } from "react";

/**
 * Steps through a looping demo, holding each step for its duration.
 * Pauses (keeping the current step) while `playing` is false.
 */
export function useDemoTimeline(durations: readonly number[], playing: boolean) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(
      () => setStep((current) => (current + 1) % durations.length),
      durations[step],
    );
    return () => clearTimeout(timer);
  }, [durations, playing, step]);

  return step;
}
