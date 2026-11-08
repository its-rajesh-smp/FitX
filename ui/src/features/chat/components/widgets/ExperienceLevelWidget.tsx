import { ArrowRight, Dumbbell, Flame, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WIDGET_OPTION_CLASS,
  WIDGET_TONES,
} from "@/features/chat/constants/widgetTones";
import { cn } from "@/lib/utils";

const EXPERIENCE_OPTIONS = [
  {
    label: "Never really worked out before",
    description: "We will keep your first plan simple and approachable.",
    Icon: Sprout,
    iconClassName: WIDGET_TONES.violet,
  },
  {
    label: "Worked out before, but not consistently (less than 6 months)",
    description: "We will help you build a steady routine.",
    Icon: Dumbbell,
    iconClassName: WIDGET_TONES.iris,
  },
  {
    label: "I work out regularly (6+ months)",
    description: "We can use more variety and challenging movements.",
    Icon: Flame,
    iconClassName: WIDGET_TONES.peach,
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
    <div className="mt-4 grid gap-2">
      {EXPERIENCE_OPTIONS.map(
        ({ label, description, Icon, iconClassName }) => (
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
        ),
      )}
    </div>
  );
}
