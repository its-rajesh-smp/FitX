import { Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import studioImage from "@/assets/landing/studio.webp";
import { Card } from "@/features/landing/components/ui/Card";
import { TileHeading } from "@/features/landing/components/features/TileHeading";
import { useFakePlayer } from "@/features/landing/hooks/useFakePlayer";
import { cn } from "@/lib/utils";

const DURATION = 42;

function formatTime(seconds: number) {
  return `0:${String(seconds).padStart(2, "0")}`;
}

export function VideoTile({ className }: { className?: string }) {
  const { playing, elapsed, progress, toggle } = useFakePlayer(DURATION);

  return (
    <Card className={cn("flex flex-col gap-5 p-2 sm:p-2", className)}>
      <div className="relative min-h-44 flex-1 overflow-hidden rounded-[20px] bg-sunken">
        <img
          src={studioImage}
          alt="A yoga mat and dumbbells by a sunny window"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause the form guide" : "Play the form guide"}
          className="group absolute inset-0 flex items-center justify-center"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-ink/90 text-white shadow-float backdrop-blur transition-transform duration-300 ease-calm group-hover:scale-105 group-active:scale-95">
            {playing ? (
              <Pause aria-hidden className="size-5 fill-current" />
            ) : (
              <Play aria-hidden className="ml-0.5 size-5 fill-current" />
            )}
          </span>
        </button>
        <div className="absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-full bg-surface/85 px-3 py-1.5 backdrop-blur">
          <span className="font-mono text-[11px] text-ink-soft tabular-nums">{formatTime(elapsed)}</span>
          <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-line">
            <motion.span
              className="absolute inset-0 origin-left rounded-full bg-accent-edge"
              initial={false}
              animate={{ scaleX: progress }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </span>
          <span className="font-mono text-[11px] text-subtle tabular-nums">{formatTime(DURATION)}</span>
        </div>
      </div>
      <div className="px-4 pb-5">
        <TileHeading
          tone="iris"
          lead="Video guides"
          rest="for every move"
          text="Not sure about your form? Watch a short guide right from your plan."
        />
      </div>
    </Card>
  );
}
