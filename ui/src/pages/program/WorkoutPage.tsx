import { ArrowLeft, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/features/program/components/ExerciseCard";
import { useProgram } from "@/features/program/hooks/useProgram";
import { useWorkoutStore } from "@/features/program/stores/useWorkoutStore";

const EMPTY_COMPLETED_EXERCISES: string[] = [];

export function WorkoutPage() {
  const { dayId = "" } = useParams();
  const programQuery = useProgram();
  const day = programQuery.data?.days.find((item) => item.id === dayId);
  const completed = useWorkoutStore(
    (state) => state.completed[dayId] ?? EMPTY_COMPLETED_EXERCISES,
  );
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);

  if (programQuery.isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-8 text-muted-foreground">Loading workout...</div>;
  }

  if (!day) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/plan" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />Back to program</Link>
        <p className="mt-8 text-muted-foreground">This workout day could not be found.</p>
      </div>
    );
  }

  const muscles = [
    ...new Set(day.exercises.flatMap(({ exercise }) => exercise.primaryMuscles)),
  ];
  const isComplete = day.exercises.length > 0 && completed.length === day.exercises.length;
  const progress = day.exercises.length
    ? (completed.length / day.exercises.length) * 100
    : 0;
  const scheduledDate = new Date(
    `${day.scheduledAt.slice(0, 10)}T00:00:00`,
  ).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 lg:py-10">
      <Link to="/plan" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />Back to program</Link>
      {isComplete && (
        <section className="mt-6 rounded-xl border border-success/30 bg-success-soft p-5 text-success">
          <h2 className="text-lg font-extrabold">Day Complete!</h2>
          <p className="mt-1 text-sm">{day.exercises.length} exercises completed</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild className="bg-success text-white hover:bg-success/80"><Link to="/plan">Back to Program</Link></Button>
            <Button asChild variant="outline" className="border-success text-success"><Link to="/chat"><MessageSquare />Chat with AI</Link></Button>
          </div>
        </section>
      )}
      <header className="mt-7">
        <div className="flex items-center gap-3"><Badge>{scheduledDate}</Badge><span className="text-xs text-muted-foreground">{day.exercises.length} exercises</span></div>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{day.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2">{muscles.map((muscle) => <Badge key={muscle}>{muscle}</Badge>)}</div>
        <p className="mt-7 text-sm text-muted-foreground">{completed.length} of {day.exercises.length} exercises done</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
      </header>
      <div className="mt-7 space-y-4">
        {day.exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} done={completed.includes(exercise.id)} onToggle={() => toggleExercise(day.id, exercise.id)} />
        ))}
      </div>
    </div>
  );
}
