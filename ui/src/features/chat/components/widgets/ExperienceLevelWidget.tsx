import { ArrowRight, Dumbbell, Flame, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXPERIENCE_OPTIONS = [
  {
    label: "Never really worked out before",
    description: "We will keep your first plan simple and approachable.",
    Icon: Sprout,
  },
  {
    label: "Worked out before, but not consistently (less than 6 months)",
    description: "We will help you build a steady routine.",
    Icon: Dumbbell,
  },
  {
    label: "I work out regularly (6+ months)",
    description: "We can use more variety and challenging movements.",
    Icon: Flame,
  },
] as const;

export function ExperienceLevelWidget({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (values: string[]) => void;
}) {
  return (
    <div className="bg-card shadow-card mt-3 grid gap-2 rounded-2xl border p-2.5 sm:p-3">
      {EXPERIENCE_OPTIONS.map(({ label, description, Icon }) => (
        <Button
          key={label}
          type="button"
          variant="outline"
          disabled={disabled}
          className="group hover:border-primary/40 hover:bg-primary-soft h-auto min-h-16 justify-start gap-3 rounded-xl px-3 py-3 text-left whitespace-normal"
          onClick={() => onSubmit([label])}
        >
          <span className="bg-primary-soft text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
            <Icon className="size-4.5" />
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
