export type Exercise = {
  name: string;
  muscle: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  equipment: string;
  sets: string;
  rest: string;
  note: string;
};

export type WorkoutDay = {
  day: number;
  week: number;
  title: string;
  muscles: string;
  exercises: Exercise[];
};

const workoutTemplates: Record<string, Exercise[]> = {
  "Push Day": [
    {
      name: "Dumbbell Bench Press",
      muscle: "Chest",
      difficulty: "Intermediate",
      equipment: "Dumbbells",
      sets: "4 sets × 10 reps",
      rest: "75s rest",
      note: "Focus on full range of motion",
    },
    {
      name: "Dumbbell Shoulder Press",
      muscle: "Shoulders",
      difficulty: "Intermediate",
      equipment: "Dumbbells",
      sets: "3 sets × 10 reps",
      rest: "60s rest",
      note: "Keep core braced",
    },
    {
      name: "Push-Up",
      muscle: "Chest",
      difficulty: "Beginner",
      equipment: "Bodyweight",
      sets: "3 sets × 12 reps",
      rest: "60s rest",
      note: "Slow on the way down",
    },
    {
      name: "Lateral Raise",
      muscle: "Shoulders",
      difficulty: "Beginner",
      equipment: "Dumbbells",
      sets: "3 sets × 15 reps",
      rest: "45s rest",
      note: "Light weight, strict form",
    },
    {
      name: "Tricep Dips",
      muscle: "Triceps",
      difficulty: "Intermediate",
      equipment: "Bodyweight",
      sets: "3 sets × 12 reps",
      rest: "60s rest",
      note: "Burnout finisher",
    },
  ],
  "Pull Day": [
    {
      name: "Pull-Up",
      muscle: "Back",
      difficulty: "Intermediate",
      equipment: "Pull-up bar",
      sets: "4 sets × 8 reps",
      rest: "90s rest",
      note: "Lead with your chest",
    },
    {
      name: "One-Arm Row",
      muscle: "Back",
      difficulty: "Intermediate",
      equipment: "Dumbbells",
      sets: "4 sets × 10 reps",
      rest: "75s rest",
      note: "Keep your back flat",
    },
    {
      name: "Reverse Fly",
      muscle: "Back",
      difficulty: "Beginner",
      equipment: "Dumbbells",
      sets: "3 sets × 12 reps",
      rest: "60s rest",
      note: "Squeeze shoulder blades",
    },
    {
      name: "Bicep Curl",
      muscle: "Biceps",
      difficulty: "Beginner",
      equipment: "Dumbbells",
      sets: "3 sets × 12 reps",
      rest: "45s rest",
      note: "Control the lowering phase",
    },
    {
      name: "Hammer Curl",
      muscle: "Biceps",
      difficulty: "Intermediate",
      equipment: "Dumbbells",
      sets: "3 sets × 10 reps",
      rest: "45s rest",
      note: "Keep elbows tucked",
    },
  ],
  "Leg Day": [
    {
      name: "Goblet Squat",
      muscle: "Quads",
      difficulty: "Intermediate",
      equipment: "Dumbbells",
      sets: "4 sets × 10 reps",
      rest: "90s rest",
      note: "Go deep",
    },
    {
      name: "Romanian Deadlift",
      muscle: "Hamstrings",
      difficulty: "Intermediate",
      equipment: "Dumbbells",
      sets: "4 sets × 10 reps",
      rest: "75s rest",
      note: "Feel the stretch in your hamstrings",
    },
    {
      name: "Bulgarian Split Squat",
      muscle: "Quads",
      difficulty: "Advanced",
      equipment: "Dumbbells",
      sets: "3 sets × 10 reps",
      rest: "75s rest",
      note: "Each leg",
    },
    {
      name: "Calf Raise",
      muscle: "Calves",
      difficulty: "Beginner",
      equipment: "Bodyweight",
      sets: "4 sets × 20 reps",
      rest: "45s rest",
      note: "Pause at the top",
    },
    {
      name: "Plank",
      muscle: "Core",
      difficulty: "Beginner",
      equipment: "Bodyweight",
      sets: "3 sets × 60 sec",
      rest: "45s rest",
      note: "Hold for 60 seconds",
    },
  ],
  "Core + Cardio": [
    {
      name: "Mountain Climbers",
      muscle: "Core",
      difficulty: "Intermediate",
      equipment: "Bodyweight",
      sets: "4 sets × 30 sec",
      rest: "30s rest",
      note: "Keep a steady pace",
    },
    {
      name: "Russian Twist",
      muscle: "Core",
      difficulty: "Intermediate",
      equipment: "Dumbbells",
      sets: "3 sets × 20 reps",
      rest: "45s rest",
      note: "Rotate through your torso",
    },
    {
      name: "High Knees",
      muscle: "Cardio",
      difficulty: "Beginner",
      equipment: "Bodyweight",
      sets: "4 sets × 30 sec",
      rest: "30s rest",
      note: "Stay light on your feet",
    },
    {
      name: "Dead Bug",
      muscle: "Core",
      difficulty: "Beginner",
      equipment: "Bodyweight",
      sets: "3 sets × 12 reps",
      rest: "45s rest",
      note: "Keep lower back grounded",
    },
    {
      name: "Burpees",
      muscle: "Cardio",
      difficulty: "Advanced",
      equipment: "Bodyweight",
      sets: "3 sets × 10 reps",
      rest: "60s rest",
      note: "Finish strong",
    },
  ],
};

const cycle = [
  ["Push Day", "Chest, Shoulders & Triceps"],
  ["Pull Day", "Back & Biceps"],
  ["Leg Day", "Quads, Hamstrings, Glutes & Calves"],
  ["Core + Cardio", "Core & Conditioning"],
] as const;

export const programDays: WorkoutDay[] = Array.from(
  { length: 16 },
  (_, index) => {
    const day = index + 1;
    const [title, muscles] = cycle[index % cycle.length];
    return {
      day,
      week: Math.ceil(day / 4),
      title,
      muscles,
      exercises: workoutTemplates[title],
    };
  },
);
