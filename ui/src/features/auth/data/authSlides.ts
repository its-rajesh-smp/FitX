import fujiImage from "@/assets/auth/auth-fuji.webp";
import pineImage from "@/assets/auth/auth-pine.webp";
import teaImage from "@/assets/auth/auth-tea.webp";

export interface AuthSlide {
  image: string;
  /** Sampled from the artwork's top edge so the painting melts into the panel. */
  sky: string;
  statement: string;
  attribution: string;
  lines: [string, string];
}

// Shared by sign-in and sign-up. Painted in the same soft, misty style as the
// landing hero. Copy is product truths about what FitX does today, not testimonials.
export const AUTH_SLIDES: AuthSlide[] = [
  {
    image: fujiImage,
    sky: "#eeeafa",
    statement:
      "Tell FitX your goal, your gear and your time. Get a week of training you can change just by asking.",
    attribution: "What FitX does, in two sentences",
    lines: [
      "No forms, no long quizzes. A few taps in the chat and your plan is ready.",
      "Moved a workout or missing a dumbbell? Say so, and your week adjusts.",
    ],
  },
  {
    image: teaImage,
    sky: "#eee9fa",
    statement:
      "Ask for a swap, a shorter session or a rest day. FitX rewrites only what you asked for.",
    attribution: "Change anything, just by asking",
    lines: [
      "Every exercise comes with a video guide, so you know the form before you start.",
      "Tick off exercises as you go and watch your week fill in.",
    ],
  },
  {
    image: pineImage,
    sky: "#e8e5f8",
    statement:
      "FitX remembers your level, your equipment and how long you have, so you never repeat yourself.",
    attribution: "A trainer that remembers",
    lines: [
      "Two dumbbells at home or a full gym, the plan uses what you actually have.",
      "Sets and reps start where you are today, not where an app assumes you are.",
    ],
  },
];

export const AUTH_SLIDE_INTERVAL_MS = 7000;
