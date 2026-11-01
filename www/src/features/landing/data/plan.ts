export type PlanExercise = {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: number;
  rest: number;
};

export type PlanDay = {
  short: string;
  label: string;
  exercises: PlanExercise[];
};

/** A sample beginner home week, shaped like a real FitX plan. */
export const SAMPLE_WEEK: PlanDay[] = [
  {
    short: "Mon",
    label: "Full Body Foundation",
    exercises: [
      { id: "mon-1", name: "Bodyweight Squat", muscle: "Quadriceps", sets: 3, reps: 12, rest: 60 },
      { id: "mon-2", name: "Pushups", muscle: "Chest", sets: 3, reps: 10, rest: 60 },
      { id: "mon-3", name: "Glute Bridge", muscle: "Glutes", sets: 3, reps: 15, rest: 45 },
      { id: "mon-4", name: "Plank", muscle: "Abdominals", sets: 3, reps: 30, rest: 45 },
    ],
  },
  {
    short: "Tue",
    label: "Core and Mobility",
    exercises: [
      { id: "tue-1", name: "Dead Bug", muscle: "Abdominals", sets: 3, reps: 10, rest: 45 },
      { id: "tue-2", name: "Superman", muscle: "Lower back", sets: 3, reps: 12, rest: 45 },
      { id: "tue-3", name: "Side Plank", muscle: "Abdominals", sets: 2, reps: 20, rest: 30 },
    ],
  },
  { short: "Wed", label: "Rest", exercises: [] },
  {
    short: "Thu",
    label: "Lower Body Basics",
    exercises: [
      { id: "thu-1", name: "Reverse Lunge", muscle: "Quadriceps", sets: 3, reps: 10, rest: 60 },
      { id: "thu-2", name: "Single Leg Glute Bridge", muscle: "Glutes", sets: 3, reps: 10, rest: 45 },
      { id: "thu-3", name: "Calf Raises", muscle: "Calves", sets: 3, reps: 15, rest: 30 },
      { id: "thu-4", name: "Wall Sit", muscle: "Quadriceps", sets: 2, reps: 30, rest: 45 },
    ],
  },
  {
    short: "Fri",
    label: "Upper Body Push",
    exercises: [
      { id: "fri-1", name: "Incline Pushups", muscle: "Chest", sets: 3, reps: 12, rest: 60 },
      { id: "fri-2", name: "Bench Dips", muscle: "Triceps", sets: 3, reps: 10, rest: 60 },
      { id: "fri-3", name: "Pike Pushups", muscle: "Shoulders", sets: 3, reps: 8, rest: 60 },
    ],
  },
  {
    short: "Sat",
    label: "Active Recovery",
    exercises: [
      { id: "sat-1", name: "Cat Stretch", muscle: "Lower back", sets: 2, reps: 10, rest: 30 },
      { id: "sat-2", name: "World's Greatest Stretch", muscle: "Hamstrings", sets: 2, reps: 6, rest: 30 },
    ],
  },
  { short: "Sun", label: "Rest", exercises: [] },
];
