import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ProgramPreview() {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border bg-white">
      <div className="bg-primary p-5 text-white">
        <p className="text-[10px] font-bold tracking-widest text-white/70">
          PERSONALIZED PROGRAM
        </p>
        <h3 className="mt-1 text-xl font-extrabold">4-Week Muscle Building</h3>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-white/90">
          <span>
            <CalendarDays className="mr-1 inline size-3" />4 days/week
          </span>
          <span>
            <Clock3 className="mr-1 inline size-3" />
            45 min/session
          </span>
          <span>
            <Dumbbell className="mr-1 inline size-3" />
            Dumbbells + bar
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x border-b py-3 text-center">
        <div>
          <strong>16</strong>
          <p className="text-muted-foreground text-[10px]">WORKOUTS</p>
        </div>
        <div>
          <strong>~12h</strong>
          <p className="text-muted-foreground text-[10px]">TOTAL TIME</p>
        </div>
        <div>
          <strong>Strength</strong>
          <p className="text-muted-foreground text-[10px]">GOAL</p>
        </div>
      </div>
      {["Foundation", "Volume", "Intensity", "Peak"].map((name, index) => (
        <div key={name} className="flex items-center gap-3 border-b px-4 py-3">
          <span className="bg-primary-soft text-primary flex size-8 items-center justify-center rounded-full text-sm font-bold">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-bold">
              Week {index + 1} · {name}
            </p>
            <p className="text-muted-foreground text-xs">
              {
                [
                  "Build base strength & form",
                  "Increase working sets",
                  "Heavier loads, lower reps",
                  "Test progress & deload",
                ][index]
              }
            </p>
          </div>
          <Target className="text-muted-foreground ml-auto size-4" />
        </div>
      ))}
      <p className="text-muted-foreground px-4 pt-4 text-xs">
        <CheckCircle2 className="text-success mr-1 inline size-4" />
        Adapts to your progress weekly
      </p>
      <div className="p-4">
        <Button asChild className="h-10 w-full rounded-lg">
          <Link to="/chat">
            Open workout planner <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
