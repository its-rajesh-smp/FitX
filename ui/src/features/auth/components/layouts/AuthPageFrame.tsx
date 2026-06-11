import { Dumbbell, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthWorkoutIllustration } from "./AuthWorkoutIllustration";

export function AuthPageFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="bg-primary relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col">
        <div className="absolute top-1/3 -left-24 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -top-20 -right-20 size-80 rounded-full bg-white/15 blur-3xl" />
        <Link
          to="/"
          className="relative flex w-fit cursor-pointer items-center gap-3 text-xl font-extrabold"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Dumbbell />
          </span>
          FitAI
        </Link>
        <div className="relative my-auto max-w-lg">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur">
            <Sparkles className="mr-2 size-4" />
            Training made personal
          </span>
          <h1 className="mt-6 text-5xl leading-tight font-extrabold tracking-tight">
            Your goals. Your schedule. Your workout plan.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            FitAI turns your goals, available equipment, and weekly schedule
            into a practical workout plan you can follow.
          </p>
          <div className="mt-6 max-w-md">
            <AuthWorkoutIllustration />
          </div>
        </div>
        <p className="relative text-sm text-white/60">
          Train with a plan built around you.
        </p>
      </section>
      <section className="bg-canvas relative flex items-center justify-center overflow-hidden px-4 py-10">
        <div className="bg-primary/8 absolute top-10 -right-20 size-64 rounded-full blur-3xl" />
        <div className="bg-primary/6 absolute -bottom-24 left-10 size-72 rounded-full blur-3xl" />
        <div className="relative w-full max-w-md">
          <Link
            to="/"
            className="mb-10 flex cursor-pointer items-center justify-center gap-2 text-xl font-extrabold lg:hidden"
          >
            <span className="bg-primary flex size-9 items-center justify-center rounded-lg text-white">
              <Dumbbell className="size-5" />
            </span>
            FitAI
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
