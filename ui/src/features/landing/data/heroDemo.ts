/** Script for the looping chat demo on the hero stage. */
export const DEMO_STEP = {
  typing: 0,
  sent: 1,
  thinkingAsk: 2,
  asked: 3,
  answered: 4,
  thinkingPlan: 5,
  ready: 6,
} as const;

/** How long each step is held, in ms (indexed by DEMO_STEP). */
export const DEMO_DURATIONS = [2600, 700, 1300, 1700, 900, 1500, 6500] as const;

export const DEMO_GREETING = "Hi, I'm FitX. What would you like to work on?";

export const DEMO_USER_MESSAGE = "I want to get stronger at home, about 30 min a day";

export const DEMO_ASK =
  "Got it: home, bodyweight only, about 30 minutes. How much have you trained before?";

export const DEMO_READY = "Your week is ready: 5 training days and 2 rest days. Ask me to change anything.";

export const DEMO_EXPERIENCE = [
  { label: "Never really worked out", hint: "Start simple and steady" },
  { label: "On and off, under 6 months", hint: "Build a regular routine" },
  { label: "Regularly, 6+ months", hint: "More variety and challenge" },
] as const;

export const DEMO_PLAN_ROWS = [
  { day: "Mon", label: "Full Body Foundation", count: 4 },
  { day: "Tue", label: "Core and Mobility", count: 3 },
  { day: "Wed", label: "Rest", count: 0 },
  { day: "Thu", label: "Lower Body Basics", count: 4 },
  { day: "Fri", label: "Upper Body Push", count: 3 },
  { day: "Sat", label: "Active Recovery", count: 2 },
  { day: "Sun", label: "Rest", count: 0 },
] as const;
