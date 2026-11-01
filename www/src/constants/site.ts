const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:5173";

export const SITE = {
  name: "FitX",
  description: "An AI personal trainer that builds your weekly workout plan in a chat.",
  appUrl: APP_URL,
  signUpUrl: `${APP_URL}/register`,
  signInUrl: `${APP_URL}/login`,
} as const;

export const NAV_LINKS = [
  { id: "how", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "week", label: "Your week" },
  { id: "faq", label: "FAQ" },
] as const;
