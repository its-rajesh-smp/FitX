import { EXERCISE_MUSCLES } from "@/features/chat/constants/exerciseFilters";

export const WORKOUT_TARGETS = {
  "Full Body": EXERCISE_MUSCLES,
  "Upper Body": [
    "abdominals",
    "biceps",
    "chest",
    "forearms",
    "lats",
    "lower back",
    "middle back",
    "neck",
    "shoulders",
    "traps",
    "triceps",
  ],
  "Lower Body": [
    "abductors",
    "adductors",
    "calves",
    "glutes",
    "hamstrings",
    "quadriceps",
  ],
} as const;

export type WorkoutTarget = keyof typeof WORKOUT_TARGETS;
