import { Check } from "lucide-react";
import meadowImage from "@/assets/landing/meadow.webp";
import { SectionHeading } from "@/features/landing/components/ui/SectionHeading";
import { WeekPlanner } from "@/features/landing/components/week/WeekPlanner";

const POINTS = [
  "Sets, reps and rest for every exercise",
  "A clear focus for each day, with rest built in",
  "Tick exercises off as you train",
];

export function YourWeek() {
  return (
    <section id="week" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="reveal flex flex-col gap-8">
          <SectionHeading
            align="start"
            index={3}
            badge="Your week"
            title="Know exactly what to do today"
            description="Open your plan and start. This is a sample beginner week; go ahead and try it."
          />
          <ul className="flex flex-col gap-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 text-[15px] text-ink-soft">
                <span className="flex size-5 items-center justify-center rounded-full bg-accent text-ink">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal relative overflow-hidden rounded-[36px] border border-line p-3 shadow-card sm:p-6">
          <img
            src={meadowImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="relative">
            <WeekPlanner />
          </div>
        </div>
      </div>
    </section>
  );
}
