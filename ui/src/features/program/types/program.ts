export interface CatalogExercise {
  id: string;
  name: string;
  level: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

export interface ProgramExercise {
  id: string;
  exerciseId: string;
  sets: number | null;
  reps: number | null;
  rest: number | null;
  isCompleted: boolean;
  order: number;
  exercise: CatalogExercise;
}

export interface ProgramDay {
  id: string;
  name: string;
  scheduledAt: string;
  exercises: ProgramExercise[];
}

export interface ProgramPlan {
  id: string;
  isCompleted: boolean;
  days: ProgramDay[];
}
