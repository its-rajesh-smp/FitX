export const EXERCISE_LEVELS = ["beginner", "intermediate", "expert"] as const;

export const EXERCISE_EQUIPMENT = [
  "bands",
  "barbell",
  "body only",
  "cable",
  "dumbbell",
  "exercise ball",
  "e-z curl bar",
  "foam roll",
  "kettlebells",
  "machine",
  "medicine ball",
  "other",
] as const;

export const EXERCISE_MUSCLES = [
  "abdominals",
  "abductors",
  "adductors",
  "biceps",
  "calves",
  "chest",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "lower back",
  "middle back",
  "neck",
  "quadriceps",
  "shoulders",
  "traps",
  "triceps",
] as const;

export type ExerciseLevel = (typeof EXERCISE_LEVELS)[number];
export type ExerciseEquipment = (typeof EXERCISE_EQUIPMENT)[number];
export type ExerciseMuscle = (typeof EXERCISE_MUSCLES)[number];
