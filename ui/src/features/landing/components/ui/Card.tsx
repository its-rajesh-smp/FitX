import type { ReactNode } from "react";
import { CARD_TONES, type CardTone } from "@/features/landing/constants/cardTones";
import { cn } from "@/lib/utils";

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
    <div className={cn("rounded-[28px] border p-6 shadow-card sm:p-7", CARD_TONES[tone], className)}>
      {children}
    </div>
  );
}
