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
  exercise: CatalogExercise;
}

export interface ProgramDay {
  id: string;
  name: string;
  order: number;
  isCompleted: boolean;
  exercises: ProgramExercise[];
}

export interface ProgramPlan {
  id: string;
  isCompleted: boolean;
  days: ProgramDay[];
}
