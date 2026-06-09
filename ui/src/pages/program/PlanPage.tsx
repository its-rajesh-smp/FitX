import { ArrowRight, Circle, Dumbbell, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useProgram } from "@/features/program/hooks/useProgram";
import type { ProgramDay } from "@/features/program/types/program";

const getMuscles = (day: ProgramDay) =>
  [...new Set(day.exercises.flatMap(({ exercise }) => exercise.primaryMuscles))]
    .join(", ") || "Full body";

const getEquipment = (day: ProgramDay) =>
  [
    ...new Set(
      day.exercises.map(({ exercise }) => exercise.equipment ?? "Body only"),
    ),
  ].join(", ");

const formatScheduledDate = (scheduledAt: string) =>
  new Date(`${scheduledAt.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export function PlanPage() {
  const user = useAuthStore((state) => state.user);
  const programQuery = useProgram();
  const days = programQuery.data?.days ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const currentDay =
    days.find((day) => day.scheduledAt.slice(0, 10) >= today) ?? days[0];

  if (programQuery.isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-muted-foreground">Loading your program...</div>;
  }

  if (programQuery.isError) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-destructive">Unable to load your program right now.</div>;
  }

  if (!currentDay) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 lg:py-12">
        <section className="rounded-xl border bg-white p-8 text-center shadow-card">
          <Dumbbell className="mx-auto size-10 text-primary" />
          <h1 className="mt-4 text-3xl font-extrabold">Your program is ready for a plan</h1>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Ask FitX to create a workout plan and it will appear here.
          </p>
          <Button asChild className="mt-6 h-11 px-6">
            <Link to="/chat">Create a plan with FitX <ArrowRight /></Link>
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 lg:py-12">
      <section>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your workout program{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {days.length} scheduled workout {days.length === 1 ? "day" : "days"}
        </p>
      </section>

      <section className="mt-8 flex flex-col gap-5 rounded-xl border-l-4 border-l-primary bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge>NEXT WORKOUT</Badge>
          <h2 className="mt-3 text-2xl font-extrabold">{currentDay.name}</h2>
          <p className="text-sm font-medium text-primary">{formatScheduledDate(currentDay.scheduledAt)}</p>
          <p className="text-muted-foreground">{getMuscles(currentDay)}</p>
          <div className="mt-5 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span><Dumbbell className="mr-1 inline size-4" />{currentDay.exercises.length} exercises</span>
            <span><Timer className="mr-1 inline size-4" />~{currentDay.exercises.length * 7} min</span>
            <span>{getEquipment(currentDay)}</span>
          </div>
        </div>
        <Button asChild className="h-11 rounded-lg px-6">
          <Link to={`/plan/${currentDay.id}`}>Start Workout <ArrowRight /></Link>
        </Button>
      </section>

      <section className="mt-10">
        <h2 className="font-extrabold">Full Program</h2>
        <div className="mt-4 overflow-hidden rounded-xl border bg-white shadow-card">
          {days.map((day) => (
            <Link key={day.id} to={`/plan/${day.id}`} className={`flex items-center gap-3 border-b px-4 py-3.5 last:border-0 hover:bg-primary-soft/40 ${day.id === currentDay.id ? "bg-primary-soft/60" : ""}`}>
              {day.id === currentDay.id ? (
                <span className="size-4 rounded-full bg-primary" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold">{day.name}</p>
                <p className="truncate text-xs text-muted-foreground">{getMuscles(day)}</p>
              </div>
              <span className="ml-auto text-right text-xs text-muted-foreground">
                {formatScheduledDate(day.scheduledAt)}
                <span className="block">{day.exercises.length} exercises</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
