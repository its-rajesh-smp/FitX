import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex size-7 items-center justify-center rounded-full bg-ink text-accent">
        <Dumbbell aria-hidden className="size-4 rotate-45" strokeWidth={2.25} />
      </span>
      <span className="text-[17px] leading-none font-semibold tracking-[-0.02em]">FitX</span>
    </span>
  );
}
