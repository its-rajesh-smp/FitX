import { create } from "zustand";

type WorkoutState = {
  completed: Record<number, number[]>;
  toggleExercise: (day: number, exercise: number) => void;
};

export const useWorkoutStore = create<WorkoutState>((set) => ({
  completed: {
    1: [0, 1, 2, 3, 4],
    2: [0, 1, 2, 3, 4],
    3: [0, 1, 2, 3, 4],
    4: [0, 1, 2, 3, 4],
    5: [0, 1, 2, 3, 4],
    6: [0, 1, 2, 3, 4],
  },
  toggleExercise: (day, exercise) =>
    set((state) => {
      const current = state.completed[day] ?? [];
      return {
        completed: {
          ...state.completed,
          [day]: current.includes(exercise)
            ? current.filter((item) => item !== exercise)
            : [...current, exercise],
        },
      };
    }),
}));
