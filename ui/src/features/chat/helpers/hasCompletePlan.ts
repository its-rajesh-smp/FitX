import type { ProgramPlan } from "@/features/program/types/program";

export const hasCompletePlan = (plan?: ProgramPlan | null) => {
  const days = plan?.days ?? [];

  return (
    days.length === 7 &&
    new Set(days.map((day) => day.dayNumber)).size === 7 &&
    days.some((day) => day.exercises.length > 0)
  );
};
