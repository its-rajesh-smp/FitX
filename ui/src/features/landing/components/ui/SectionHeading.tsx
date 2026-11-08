import type { ReactNode } from "react";
import { SetBadge } from "@/features/landing/components/ui/SetBadge";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  badge,
  title,
  description,
  align = "center",
}: {
  index: number;
  badge: string;
  title: ReactNode;
  description: string;
  align?: "center" | "start";
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-5",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
      )}
    >
      <SetBadge index={index} label={badge} />
      <h2 className="text-4xl font-medium tracking-[-0.025em] text-balance sm:text-5xl sm:leading-[1.1]">
        {title}
      </h2>
      <p className="text-lg leading-relaxed text-pretty text-muted">{description}</p>
    </div>
  );
}
