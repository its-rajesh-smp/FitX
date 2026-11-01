import { Brain } from "lucide-react";
import memoryImage from "@/assets/images/card_memory.webp";
import { Card } from "@/components/ui/Card";
import { TileBackdrop } from "@/features/landing/components/features/TileBackdrop";
import { TileHeading } from "@/features/landing/components/features/TileHeading";
import { MEMORY_ROWS } from "@/features/landing/data/landing";
import { cn } from "@/lib/utils";

export function MemoryTile({ className }: { className?: string }) {
  return (
    <Card className={cn("group relative isolate flex flex-col gap-6 overflow-hidden", className)}>
      <TileBackdrop src={memoryImage} />
      <TileHeading
        tone="rose"
        lead="Remembers"
        rest="what matters"
        text="Your level, gear and time carry over, so you never repeat yourself."
      />
      <ul className="mt-auto flex flex-col gap-1.5">
        {MEMORY_ROWS.map((row, index) => (
          <li
            key={row.label}
            className={cn(
              "flex items-center gap-3 rounded-2xl bg-surface px-3 py-2 shadow-card transition-transform duration-300 ease-calm group-hover:translate-x-0.5",
              index === 1 && "[transition-delay:60ms]",
              index === 2 && "[transition-delay:120ms]",
            )}
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-rose-tint text-rose-ink">
              <Brain aria-hidden className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-muted">{row.label}</p>
              <p className="truncate text-[13px] font-semibold">{row.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
