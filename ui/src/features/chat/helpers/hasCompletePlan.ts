import type { ProgramPlan } from "@/features/program/types/program";

export const hasCompletePlan = (plan?: ProgramPlan | null) => {
  const days = plan?.planDays ?? [];
  const dayNumbers = new Set(days.map((day) => day.dayNumber));

  return (
    days.length === 7 &&
    ([1, 2, 3, 4, 5, 6, 7] as const).every((dayNumber) =>
      dayNumbers.has(dayNumber),
    ) &&
    days.some((day) => day.userExercises.length > 0)
  );
};
