import ctaImage from "@/assets/landing/cta.webp";
import { ButtonLink } from "@/features/landing/components/ui/ButtonLink";
import { SITE } from "@/features/landing/constants/site";

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
      <div className="reveal relative overflow-hidden rounded-[32px] border border-line shadow-card">
        <img
          src={ctaImage}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-bottom"
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-r from-white/55 via-white/15 to-transparent" />

        <div className="relative flex max-w-xl flex-col items-start gap-6 px-6 py-16 sm:px-12 sm:py-24">
          <h2 className="text-4xl font-medium tracking-[-0.025em] text-balance sm:text-5xl sm:leading-[1.1]">
            Your first week is <span className="marker">one message</span> away
          </h2>
          <p className="text-lg leading-relaxed text-pretty text-muted">
            Say hello, answer a few taps, and start training today.
          </p>
          <ButtonLink href={SITE.signUpUrl} size="lg" withArrow>
            Build my plan
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
