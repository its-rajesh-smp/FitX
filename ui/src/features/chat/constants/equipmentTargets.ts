import { EXERCISE_EQUIPMENT } from "@/features/chat/constants/exerciseFilters";

export const EQUIPMENT_TARGETS = {
  "Gym Access": EXERCISE_EQUIPMENT,
  "Workout On Home": ["body only"],
} as const;

export type EquipmentTarget = keyof typeof EQUIPMENT_TARGETS;
