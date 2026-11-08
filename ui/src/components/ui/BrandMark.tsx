import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { box: "size-7", icon: "size-3.5" },
  md: { box: "size-8", icon: "size-4" },
} as const;

/** The FitX mark: an ink circle with a lavender dumbbell, as on the landing page. */
export function BrandMark({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-primary text-accent flex shrink-0 items-center justify-center rounded-full",
        SIZES[size].box,
        className,
      )}
    >
      <Dumbbell className={cn("rotate-45", SIZES[size].icon)} strokeWidth={2.25} />
    </span>
  );
}
