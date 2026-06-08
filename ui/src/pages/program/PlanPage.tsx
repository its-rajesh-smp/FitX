import { ArrowRight, Check, Circle, Dumbbell, Flame, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { programDays } from "@/features/program/data/program";

export function PlanPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 lg:py-12">
      <section>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Good morning, Alex <span aria-hidden>👋</span></h1>
        <p className="mt-2 text-muted-foreground">Week 2 of your muscle building program · <span className="font-bold text-foreground"><Flame className="mr-1 inline size-4 text-orange-500" />6 day streak</span></p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-[38%] rounded-full bg-primary" /></div>
        <p className="mt-2 text-xs text-muted-foreground">6 of 16 days complete</p>
      </section>

      <section className="mt-8 flex flex-col gap-5 rounded-xl border-l-4 border-l-primary bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge>TODAY</Badge>
          <h2 className="mt-3 text-2xl font-extrabold">Leg Day</h2>
          <p className="text-muted-foreground">Quads, Hamstrings, Glutes & Calves</p>
          <div className="mt-5 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span><Dumbbell className="mr-1 inline size-4" />5 exercises</span>
            <span><Timer className="mr-1 inline size-4" />~37 min</span>
            <span>Dumbbells, Bodyweight</span>
          </div>
        </div>
        <Button asChild className="h-11 rounded-lg px-6">
          <Link to="/plan/day-7">Start Workout <ArrowRight /></Link>
        </Button>
      </section>

      <section className="mt-8">
        <p className="text-xs font-bold tracking-widest text-muted-foreground">THIS WEEK</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {programDays.slice(4, 8).map((day, index) => (
            <Link key={day.day} to={`/plan/day-${day.day}`} className={`rounded-xl border bg-white p-4 shadow-card transition hover:-translate-y-0.5 ${index === 2 ? "border-2 border-primary" : ""}`}>
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                {["MON", "TUE", "THU", "FRI"][index]}
                {index < 2 ? <span className="flex size-4 items-center justify-center rounded-full bg-success text-white"><Check className="size-3" /></span> : index === 2 ? <span className="size-4 rounded-full bg-primary" /> : <Circle className="size-4" />}
              </div>
              <p className="mt-4 font-bold">{day.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{day.muscles.split(" & ")[0]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-extrabold">Full Program</h2>
        <div className="mt-4 overflow-hidden rounded-xl border bg-white shadow-card">
          {programDays.map((day) => (
            <Link key={day.day} to={`/plan/day-${day.day}`} className={`flex items-center gap-3 border-b px-4 py-3.5 last:border-0 hover:bg-primary-soft/40 ${day.day === 7 ? "bg-primary-soft/60" : ""}`}>
              {day.day <= 6 ? <span className="flex size-4 items-center justify-center rounded-full border border-success text-success"><Check className="size-3" /></span> : day.day === 7 ? <span className="size-4 rounded-full bg-primary" /> : <Circle className="size-4 text-muted-foreground" />}
              <div className="min-w-0">
                <p className="text-sm font-bold">Day {day.day} · {day.title}</p>
                <p className="truncate text-xs text-muted-foreground">{day.muscles}</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">Week {day.week}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
