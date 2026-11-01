import type { CardTone } from "@/components/ui/Card";

/** Real numbers from the FitX exercise library and plan rules. */
export const FACTS = [
  { value: 800, suffix: "+", label: "exercises with instructions" },
  { value: 17, suffix: "", label: "muscle groups to target" },
  { value: 12, suffix: "", label: "kinds of equipment supported" },
  { value: 7, suffix: "", label: "days in every plan" },
] as const;

export const STEPS = [
  {
    number: "01",
    title: "Tell FitX about you",
    text: "Your experience, the muscles you want to work, your equipment and how long you have each day.",
    tone: "peach",
  },
  {
    number: "02",
    title: "Get your week",
    text: "FitX turns your answers into a seven-day plan with sets, reps and rest you can start today.",
    tone: "iris",
  },
  {
    number: "03",
    title: "Train and adjust",
    text: "Tick off exercises as you go and change anything by sending FitX a message.",
    tone: "rose",
  },
] as const satisfies readonly { number: string; title: string; text: string; tone: CardTone }[];

export const MUSCLE_CHOICES = [
  "Chest",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Abdominals",
  "Lats",
  "Glutes",
  "Quadriceps",
  "Hamstrings",
  "Calves",
] as const;

export type Muscle = (typeof MUSCLE_CHOICES)[number];

/** A starter exercise per muscle, used to preview a week in the setup demo. */
export const MUSCLE_STARTER: Record<Muscle, string> = {
  Chest: "Pushups",
  Shoulders: "Pike Pushups",
  Biceps: "Dumbbell Curl",
  Triceps: "Bench Dips",
  Abdominals: "Plank",
  Lats: "Band Pulldown",
  Glutes: "Glute Bridge",
  Quadriceps: "Bodyweight Squat",
  Hamstrings: "Romanian Deadlift",
  Calves: "Calf Raises",
};

export const TIME_CHOICES = ["15 min", "30 min", "45 min", "60 min"] as const;

export const PREVIEW_DAYS = ["Mon", "Wed", "Fri"] as const;

export const ASK_QA = [
  {
    chip: "Rest between sets?",
    question: "How long should I rest between sets?",
    answer: "For most beginner sets, 45 to 90 seconds. Rest a little longer on heavy lifts.",
  },
  {
    chip: "Is soreness normal?",
    question: "Is it normal to feel sore?",
    answer: "Yes. Mild soreness a day or two after a new workout is normal. Sharp pain is not, so stop and rest.",
  },
  {
    chip: "Cardio or weights?",
    question: "Cardio or weights first?",
    answer: "If strength is your goal, lift first while you are fresh, then add cardio after.",
  },
] as const;

export const EQUIPMENT_CHOICES = [
  "Body only",
  "Dumbbell",
  "Kettlebells",
  "Bands",
  "Barbell",
  "Cable",
  "Machine",
  "Exercise ball",
] as const;

export const MEMORY_ROWS = [
  { label: "Experience", value: "Beginner" },
  { label: "Equipment", value: "Dumbbells, bands" },
  { label: "Time per day", value: "30 minutes" },
] as const;

export const SWAP_DEMO = {
  request: "Swap the lunges, my knee hurts today",
  before: { name: "Walking Lunges", detail: "Quadriceps · 3 × 12" },
  after: { name: "Glute Bridge", detail: "Glutes · 3 × 15" },
  reply: "Done. Glute bridges keep your legs working without loading the knee.",
} as const;

export const FAQS = [
  {
    question: "Do I need a gym?",
    answer:
      "No. Tell FitX you train at home and it builds a bodyweight plan. If you have dumbbells, bands or full gym access, it uses those instead.",
  },
  {
    question: "I have never worked out. Is FitX for me?",
    answer:
      "Yes. Say you are just starting and FitX begins with a simple full-body plan of beginner-level exercises, with clear instructions for each one.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Any time. Ask FitX to swap an exercise, move a training day or work around a sore spot, and your plan updates in place.",
  },
  {
    question: "How far ahead does FitX plan?",
    answer:
      "One week at a time: seven days with a focus for each. When you are ready for something new, ask for a fresh week.",
  },
  {
    question: "Where do the exercises come from?",
    answer:
      "From an open library of more than 800 exercises, each with its level, equipment, target muscles and step-by-step instructions. Video guides help you check your form.",
  },
  {
    question: "Can FitX set reminders?",
    answer:
      "Not yet. FitX focuses on your plan and your questions for now. It will always tell you plainly what it can and cannot do.",
  },
] as const;
