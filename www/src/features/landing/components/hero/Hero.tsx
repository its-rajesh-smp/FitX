import Image from "next/image";
import heroImage from "@/assets/images/hero.webp";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SITE } from "@/constants/site";
import { HeroStage } from "@/features/landing/components/hero/HeroStage";

export function Hero() {
  return (
    <section id="top" className="relative">
      {/* Box grows with the viewport so the dunes stay level with the button. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[440px] overflow-hidden md:h-[calc(398px_+_14.7vw)]">
        <Image
          src={heroImage}
          alt=""
          fill
          preload
          quality={86}
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <div className="absolute inset-x-0 bottom-0 h-[12%] bg-linear-to-b md:h-1/4 from-canvas/0 to-canvas" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="animate-rise text-[44px] leading-[0.98] font-normal tracking-[-0.035em] text-balance sm:text-[60px] lg:text-[76px]">
            Your personal trainer, <span className="marker">in a chat</span>
          </h1>
          <p className="mt-6 max-w-3xl animate-rise text-lg leading-relaxed text-pretty text-muted [animation-delay:75ms] sm:text-xl">
            Tell FitX your goal and get a weekly plan you can change just by asking.
          </p>
          <ButtonLink
            href={SITE.signUpUrl}
            size="lg"
            withArrow
            className="mt-9 animate-rise [animation-delay:150ms]"
          >
            Build my plan
          </ButtonLink>
        </div>

        <div className="mt-16 animate-rise [animation-delay:300ms] sm:mt-20">
          <HeroStage />
        </div>
      </div>
    </section>
  );
}
