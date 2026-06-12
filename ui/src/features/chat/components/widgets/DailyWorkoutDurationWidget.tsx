import { ArrowRight, Clock3, Hourglass, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DURATION_OPTIONS = [
  {
    label: "20-30 minutes",
    description: "A focused workout with the highest-priority movements.",
    Icon: Timer,
    iconClassName: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "1-1.5 hours",
    description: "A balanced session with primary and supporting exercises.",
    Icon: Clock3,
    iconClassName: "bg-amber-500/10 text-amber-600",
  },
  {
    label: "2+ hours",
    description: "A longer session with room for accessory and mobility work.",
    Icon: Hourglass,
    iconClassName: "bg-red-500/10 text-red-600",
  },
] as const;

export function DailyWorkoutDurationWidget({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (values: string[]) => void;
}) {
  return (
    <div className="bg-card shadow-card mt-3 grid gap-2 rounded-2xl border p-2.5 sm:p-3">
      {DURATION_OPTIONS.map(({ label, description, Icon, iconClassName }) => (
        <Button
          key={label}
          type="button"
          variant="outline"
          disabled={disabled}
          className="group hover:border-primary/40 hover:bg-primary-soft h-auto min-h-16 justify-start gap-3 rounded-xl px-3 py-3 text-left whitespace-normal"
          onClick={() => onSubmit([label])}
        >
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-md",
              iconClassName,
            )}
          >
            <Icon className="size-4.5 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm leading-5 font-semibold">
              {label}
            </span>
            <span className="text-muted-foreground mt-0.5 block text-xs leading-4 font-normal">
              {description}
            </span>
          </span>
          <ArrowRight className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Button>
      ))}
    </div>
  );
}
