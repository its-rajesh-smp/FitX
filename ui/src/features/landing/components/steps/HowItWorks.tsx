import step1Image from "@/assets/landing/step1.webp";
import step2Image from "@/assets/landing/step2.webp";
import step3Image from "@/assets/landing/step3.webp";
import { TONE_INK } from "@/features/landing/constants/cardTones";
import { SectionHeading } from "@/features/landing/components/ui/SectionHeading";
import {
  AboutYouVisual,
  TrainVisual,
  WeekVisual,
} from "@/features/landing/components/steps/StepVisuals";
import { STEPS } from "@/features/landing/data/landing";
import { cn } from "@/lib/utils";

const VISUALS = [AboutYouVisual, WeekVisual, TrainVisual];
const IMAGES = [step1Image, step2Image, step3Image];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="reveal">
        <SectionHeading
          index={1}
          badge="How it works"
          title="From first message to first workout"
          description="No forms or long quizzes. Answer a few questions in the chat and your week is ready."
        />
      </div>

      <ol className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {STEPS.map((step, index) => {
          const Visual = VISUALS[index];
          return (
            <li
              key={step.number}
              className="group reveal rounded-[28px] border border-line bg-surface p-2 shadow-card transition-transform duration-300 ease-calm hover:-translate-y-0.5"
            >
              <div className="relative flex h-40 items-stretch justify-center overflow-hidden rounded-[20px] bg-sunken">
                <img
                  src={IMAGES[index]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-calm group-hover:scale-[1.03]"
                />
                {/* Keeps the photo very light behind the chips. */}
                <div aria-hidden className="absolute inset-0 bg-white/45" />
                <div className="relative flex">
                  <Visual />
                </div>
              </div>
              <div className="px-4 pt-5 pb-5">
                <p className={cn("font-mono text-sm", TONE_INK[step.tone])}>{step.number}</p>
                <h3 className="mt-2 text-2xl font-medium tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-pretty text-muted">{step.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
