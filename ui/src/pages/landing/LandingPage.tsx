import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Dumbbell,
  MessageSquare,
  Sparkles,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const features = [
  {
    icon: BrainCircuit,
    title: "Plans built around you",
    text: "FitAI adapts training to your goals, experience, equipment, and schedule.",
  },
  {
    icon: Dumbbell,
    title: "Every workout, clearly guided",
    text: "Know exactly what to do, how many sets to complete, and how to progress.",
  },
  {
    icon: MessageSquare,
    title: "A coach in your corner",
    text: "Ask questions, swap exercises, and adjust your plan whenever life changes.",
  },
];

export function LandingPage() {
  const token = useAuthStore((state) => state.token);

  return (
    <main className="bg-canvas min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-extrabold"
        >
          <span className="bg-primary flex size-9 items-center justify-center rounded-lg text-white">
            <Dumbbell className="size-5" />
          </span>
          FitAI
        </Link>
        <div className="flex items-center gap-2">
          {token ? (
            <Button asChild>
              <Link to="/chat">
                My program <ArrowRight />
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-20 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="bg-primary-soft text-primary inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold">
            <Sparkles className="mr-2 size-4" />
            Personal training, intelligently planned
          </span>
          <h1 className="mt-6 text-5xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
            Your strongest routine starts with a plan that fits.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
            FitAI turns your goals, schedule, and available equipment into a
            practical workout program that evolves with you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild className="h-12 rounded-lg px-6">
              <Link to={token ? "/chat" : "/register"}>
                {token ? "Continue training" : "Build my free plan"}{" "}
                <ArrowRight />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 rounded-lg px-6"
            >
              <Link to={token ? "/chat" : "/login"}>
                {token ? "Chat with FitAI" : "I already have an account"}
              </Link>
            </Button>
          </div>
          <div className="text-muted-foreground mt-8 flex flex-wrap gap-5 text-sm">
            {["No guesswork", "Home or gym", "Adapts weekly"].map((item) => (
              <span key={item}>
                <CheckCircle2 className="text-success mr-1.5 inline size-4" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="bg-primary/10 absolute -inset-16 rounded-full blur-3xl" />
          <div className="relative rounded-3xl border bg-white p-5 shadow-xl">
            <div className="bg-primary rounded-2xl p-6 text-white">
              <p className="text-xs font-bold tracking-widest text-white/70">
                YOUR NEXT WORKOUT
              </p>
              <h2 className="mt-3 text-3xl font-extrabold">Leg Day</h2>
              <p className="mt-1 text-white/75">
                Quads, hamstrings, glutes & calves
              </p>
              <div className="mt-6 flex gap-5 text-sm">
                <span>
                  <Dumbbell className="mr-1 inline size-4" />5 exercises
                </span>
                <span>
                  <Timer className="mr-1 inline size-4" />
                  ~37 min
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Goblet Squat", "Romanian Deadlift", "Calf Raise", "Plank"].map(
                (exercise, index) => (
                  <div key={exercise} className="rounded-xl border p-4">
                    <span className="text-primary text-xs font-bold">
                      0{index + 1}
                    </span>
                    <p className="mt-2 font-bold">{exercise}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {index === 3 ? "3 × 60 sec" : "4 × 10 reps"}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-primary text-sm font-bold">
              BUILT FOR CONSISTENCY
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Everything you need to keep showing up.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title} className="bg-canvas rounded-2xl border p-6">
                <span className="bg-primary-soft text-primary flex size-11 items-center justify-center rounded-xl">
                  <Icon />
                </span>
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
