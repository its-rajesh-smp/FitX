import { Dumbbell, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthPageFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-primary p-12 text-white lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-3 text-xl font-extrabold"><span className="flex size-10 items-center justify-center rounded-xl bg-white/15"><Dumbbell /></span>FitAI</Link>
        <div className="my-auto max-w-lg">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold"><Sparkles className="mr-2 size-4" />Training made personal</span>
          <h1 className="mt-6 text-5xl font-extrabold leading-tight">A stronger you, one smart workout at a time.</h1>
          <p className="mt-5 text-lg text-white/75">Get a plan that adapts to your goals, equipment, schedule, and progress.</p>
        </div>
        <p className="text-sm text-white/60">Built for consistency, not perfection.</p>
      </section>
      <section className="flex items-center justify-center bg-canvas px-4 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center justify-center gap-2 text-xl font-extrabold lg:hidden"><span className="flex size-9 items-center justify-center rounded-lg bg-primary text-white"><Dumbbell className="size-5" /></span>FitAI</Link>
          {children}
        </div>
      </section>
    </main>
  );
}
