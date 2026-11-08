import { ArrowRight, Clock3, Hourglass, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WIDGET_OPTION_CLASS,
  WIDGET_TONES,
} from "@/features/chat/constants/widgetTones";
import { cn } from "@/lib/utils";

const DURATION_OPTIONS = [
  {
    label: "20-30 minutes",
    description: "A focused workout with the highest-priority movements.",
    Icon: Timer,
    iconClassName: WIDGET_TONES.iris,
  },
  {
    label: "1-1.5 hours",
    description: "A balanced session with primary and supporting exercises.",
    Icon: Clock3,
    iconClassName: WIDGET_TONES.violet,
  },
  {
    label: "2+ hours",
    description: "A longer session with room for accessory and mobility work.",
    Icon: Hourglass,
    iconClassName: WIDGET_TONES.peach,
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
    <div className="mt-4 grid gap-2">
      {DURATION_OPTIONS.map(({ label, description, Icon, iconClassName }) => (
        <Button
          key={label}
          type="button"
          variant="outline"
          disabled={disabled}
          className={WIDGET_OPTION_CLASS}
          onClick={() => onSubmit([label])}
        >
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              iconClassName,
            )}
          >
            <Icon className="size-4.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] leading-5 font-semibold">
              {label}
            </span>
            <span className="text-muted-foreground mt-0.5 block text-[12px] leading-4 font-normal">
              {description}
            </span>
          </span>
          <ArrowRight className="text-subtle group-hover:text-foreground size-4 shrink-0 transition group-hover:translate-x-0.5" />
        </Button>
      ))}
    </div>
  );
}
