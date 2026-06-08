import { ArrowLeft, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/features/program/components/ExerciseCard";
import { programDays } from "@/features/program/data/program";
import { useWorkoutStore } from "@/features/program/stores/useWorkoutStore";

export function WorkoutPage() {
  const { dayId = "day-1" } = useParams();
  const dayNumber = Number(dayId.replace("day-", "")) || 1;
  const day = programDays.find((item) => item.day === dayNumber) ?? programDays[0];
  const completed = useWorkoutStore((state) => state.completed[day.day] ?? []);
  const toggleExercise = useWorkoutStore((state) => state.toggleExercise);
  const isComplete = completed.length === day.exercises.length;
  const progressWidths = ["w-0", "w-1/5", "w-2/5", "w-3/5", "w-4/5", "w-full"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 lg:py-10">
      <Link to="/plan" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />Back to program</Link>
      {isComplete && (
        <section className="mt-6 rounded-xl border border-success/30 bg-success-soft p-5 text-success">
          <h2 className="text-lg font-extrabold">Day Complete! 🎉</h2>
          <p className="mt-1 text-sm">{day.exercises.length} exercises · ~34 min · {day.muscles.toLowerCase()}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild className="bg-success text-white hover:bg-success/80"><Link to="/plan">Back to Program</Link></Button>
            <Button asChild variant="outline" className="border-success text-success"><Link to="/chat"><MessageSquare />Chat with AI</Link></Button>
          </div>
        </section>
      )}
      <header className="mt-7">
        <div className="flex items-center gap-3"><Badge>WEEK {day.week}</Badge><span className="text-xs text-muted-foreground">Day {day.day}</span></div>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{day.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2">{day.muscles.split(/, | & /).map((muscle) => <Badge key={muscle}>{muscle}</Badge>)}</div>
        <p className="mt-7 text-sm text-muted-foreground">{completed.length} of {day.exercises.length} exercises done</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full bg-primary transition-all ${progressWidths[completed.length]}`} /></div>
      </header>
      <div className="mt-7 space-y-4">
        {day.exercises.map((exercise, index) => (
          <ExerciseCard key={exercise.name} exercise={exercise} done={completed.includes(index)} onToggle={() => toggleExercise(day.day, index)} />
        ))}
      </div>
    </div>
  );
}
