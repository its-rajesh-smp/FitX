import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  plain: "border-line bg-surface",
  violet: "border-violet-edge bg-violet-tint",
  iris: "border-iris-edge bg-iris-tint",
  peach: "border-peach-edge bg-peach-tint",
  rose: "border-rose-edge bg-rose-tint",
} as const;

export const TONE_INK = {
  plain: "text-ink",
  violet: "text-violet-ink",
  iris: "text-iris-ink",
  peach: "text-peach-ink",
  rose: "text-rose-ink",
} as const;

export type CardTone = keyof typeof TONES;

export function Card({
  tone = "plain",
  className,
  children,
}: {
  tone?: CardTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-[28px] border p-6 shadow-card sm:p-7", TONES[tone], className)}>
      {children}
    </div>
  );
}
