export const SITE = {
  name: "FitX",
  description: "An AI personal trainer that builds your weekly workout plan in a chat.",
  signUpUrl: "/register",
  signInUrl: "/login",
} as const;

export const NAV_LINKS = [
  { id: "how", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "week", label: "Your week" },
  { id: "faq", label: "FAQ" },
] as const;
