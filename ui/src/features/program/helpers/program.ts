import type { ProgramDay } from "@/features/program/types/program";

const WEEK_DAYS = [
  "Unknown day",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const formatWeekDay = (dayNumber: ProgramDay["dayNumber"]) =>
  WEEK_DAYS[dayNumber] ?? "Unknown day";

export const getProgramDayMuscles = (day: ProgramDay) =>
  [...new Set(day.userExercises.flatMap(({ exercise }) => exercise.primaryMuscles))]
    .join(", ") || "Rest and recovery";
