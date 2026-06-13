export const DAILY_WORKOUT_DURATIONS = [
  "20-30 minutes",
  "1-1.5 hours",
  "2+ hours",
] as const;

export type DailyWorkoutDuration = (typeof DAILY_WORKOUT_DURATIONS)[number];
