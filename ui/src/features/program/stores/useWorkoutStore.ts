import { create } from "zustand";

type WorkoutState = {
  completed: Record<string, string[]>;
  toggleExercise: (dayId: string, exerciseId: string) => void;
};

export const useWorkoutStore = create<WorkoutState>((set) => ({
  completed: {},
  toggleExercise: (dayId, exerciseId) =>
    set((state) => {
      const current = state.completed[dayId] ?? [];
      return {
        completed: {
          ...state.completed,
          [dayId]: current.includes(exerciseId)
            ? current.filter((item) => item !== exerciseId)
            : [...current, exerciseId],
        },
      };
    }),
}));
