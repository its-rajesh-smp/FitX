import { ArrowRight, CheckCircle2, Flame, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { benefits, highlights, steps } from "@/features/landing/data/landing";
import { ProductPreview } from "./ProductPreview";

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

interface AuthAwareSectionProps {
  isAuthenticated: boolean;
  primaryHref: string;
}

export function HeroSection({ isAuthenticated, primaryHref }: AuthAwareSectionProps) {
  return (
    <section className="relative border-t">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_15%,color-mix(in_oklch,var(--primary)_15%,transparent),transparent_35%),linear-gradient(to_bottom,var(--canvas),white_75%)]" />
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-14 px-4 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-16 [@media(max-height:900px)]:lg:gap-10 [@media(max-height:900px)]:lg:py-8">
        <motion.div
          className="relative z-10"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } } }}
        >
          <motion.span variants={heroItem} className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
            <Sparkles className="size-3.5" /> Your personal AI fitness coach
          </motion.span>
          <motion.h1 variants={heroItem} className="mt-7 max-w-2xl text-5xl leading-[1.02] font-semibold tracking-[-0.055em] sm:text-6xl lg:text-7xl [@media(max-height:900px)]:lg:mt-5 [@media(max-height:900px)]:lg:text-6xl">
            A workout plan that <span className="text-primary">actually fits</span> your life.
          </motion.h1>
          <motion.p variants={heroItem} className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 [@media(max-height:900px)]:lg:mt-4">
            FitX creates a practical weekly routine around your goals, time, equipment, and experience, then helps you adapt it through conversation.
          </motion.p>
          <motion.div variants={heroItem} className="mt-8 flex flex-col gap-3 sm:flex-row [@media(max-height:900px)]:lg:mt-6">
            <Button asChild size="lg" className="h-12 rounded-xl px-6 text-sm shadow-xl shadow-primary/20">
              <Link to={primaryHref}>
                {isAuthenticated ? "Continue training" : "Create my free plan"} <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-6 text-sm">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </motion.div>
          <motion.div variants={heroItem} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground [@media(max-height:900px)]:lg:mt-6">
            {["No credit card", "Home or gym", "Adjust anytime"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" /> {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
        <ProductPreview />
      </div>
    </section>
  );
}

export function HighlightsSection() {
  return (
    <section className="border-y bg-canvas/70">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x px-4 sm:px-8 md:grid-cols-4">
        {highlights.map(([title, text]) => (
          <div key={title} className="px-4 py-8 text-center md:px-8">
            <p className="text-lg font-semibold">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-bold tracking-[0.2em] text-primary">FITNESS WITHOUT THE FRICTION</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Less planning. More showing up.</h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Everything is designed to get you from “I should work out” to knowing exactly what to do next.
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {benefits.map(({ icon: Icon, title, text }, index) => (
          <motion.article
            key={title}
            className="group rounded-3xl border bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <span className="text-xs font-semibold text-muted-foreground/50">0{index + 1}</span>
            </div>
            <h3 className="mt-8 text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-foreground py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary"><Flame className="size-6" /></span>
          <p className="mt-8 text-xs font-bold tracking-[0.2em] text-white/50">HOW IT WORKS</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">From conversation to your next workout.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
            No complicated setup. FitX learns what matters, builds your routine, and stays available when things change.
          </p>
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {steps.map(([number, title, text]) => (
            <motion.article
              key={number}
              className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr] sm:py-9"
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-sm font-semibold text-primary">{number}</span>
              <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">{text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StartSection({ isAuthenticated, primaryHref }: AuthAwareSectionProps) {
  return (
    <section id="start" className="px-4 py-20 sm:px-8 sm:py-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-white shadow-2xl shadow-primary/25 sm:px-12 sm:py-20">
        <div className="absolute -top-32 left-1/2 size-80 -translate-x-1/2 rounded-full bg-white/15 blur-3xl" />
        <Sparkles className="relative mx-auto size-7" />
        <h2 className="relative mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Your next workout should feel clear, not complicated.
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl text-sm leading-7 text-white/75">
          Tell FitX where you are starting. Get a routine you can realistically follow.
        </p>
        <Button asChild size="lg" className="relative mt-8 h-12 rounded-xl bg-white px-6 text-primary hover:bg-white/90">
          <Link to={primaryHref}>
            {isAuthenticated ? "Open my program" : "Build my free plan"} <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}

