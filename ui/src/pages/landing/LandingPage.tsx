import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Dumbbell,
  Flame,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const benefits = [
  {
    icon: Target,
    title: "Built for your reality",
    text: "Your goals, schedule, experience, available equipment, and limitations shape every workout.",
  },
  {
    icon: MessageSquareText,
    title: "Adjust it by chatting",
    text: "Swap an exercise, change your training days, or ask for guidance without rebuilding everything.",
  },
  {
    icon: Zap,
    title: "Know exactly what to do",
    text: "Open your workout and get clear exercises, sets, reps, rest times, and instructions.",
  },
];

const steps = [
  ["01", "Tell FitX about you", "Share your goal, experience, schedule, equipment, and anything we should work around."],
  ["02", "Get your weekly plan", "FitX turns your answers into a practical routine you can start immediately."],
  ["03", "Train, track, and adapt", "Mark exercises done and keep adjusting your program as your needs change."],
];

const workoutDays = [
  ["Upper Body Introduction", "Chest, triceps", "5 exercises"],
  ["Lower Body Foundation", "Glutes, quads", "5 exercises"],
  ["Core Strength", "Abdominals, back", "5 exercises"],
  ["Mobility and Recovery", "Full body", "3 exercises"],
];

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function LandingPage() {
  const token = useAuthStore((state) => state.token);
  const primaryHref = token ? "/chat" : "/register";

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <nav className="relative z-20 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 font-bold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <Dumbbell className="size-5" />
          </span>
          <span className="text-lg tracking-tight">FitX</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#how-it-works" className="transition hover:text-foreground">How it works</a>
          <a href="#features" className="transition hover:text-foreground">Features</a>
          <a href="#start" className="transition hover:text-foreground">Get started</a>
        </div>

        <div className="flex items-center gap-2">
          {!token && (
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
          <Button asChild className="h-9 rounded-xl px-4 shadow-lg shadow-primary/15">
            <Link to={primaryHref}>
              {token ? "Open FitX" : "Build my plan"} <ArrowRight />
            </Link>
          </Button>
        </div>
      </nav>

      <section className="relative border-t">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_15%,color-mix(in_oklch,var(--primary)_15%,transparent),transparent_35%),linear-gradient(to_bottom,var(--canvas),white_75%)]" />
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-14 px-4 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-16 [@media(max-height:900px)]:lg:gap-10 [@media(max-height:900px)]:lg:py-8">
          <motion.div
            className="relative z-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
            }}
          >
            <motion.span
              variants={heroItem}
              className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm"
            >
              <Sparkles className="size-3.5" />
              Your personal AI fitness coach
            </motion.span>
            <motion.h1
              variants={heroItem}
              className="mt-7 max-w-2xl text-5xl leading-[1.02] font-semibold tracking-[-0.055em] sm:text-6xl lg:text-7xl [@media(max-height:900px)]:lg:mt-5 [@media(max-height:900px)]:lg:text-6xl"
            >
              A workout plan that{" "}
              <span className="text-primary">actually fits</span> your life.
            </motion.h1>
            <motion.p variants={heroItem} className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 [@media(max-height:900px)]:lg:mt-4">
              FitX creates a practical weekly routine around your goals, time, equipment, and experience, then helps you adapt it through conversation.
            </motion.p>
            <motion.div variants={heroItem} className="mt-8 flex flex-col gap-3 sm:flex-row [@media(max-height:900px)]:lg:mt-6">
              <Button asChild size="lg" className="h-12 rounded-xl px-6 text-sm shadow-xl shadow-primary/20">
                <Link to={primaryHref}>
                  {token ? "Continue training" : "Create my free plan"} <ArrowRight />
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

      <section className="border-y bg-canvas/70">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x px-4 sm:px-8 md:grid-cols-4">
          {[
            ["Personal", "Plans shaped around you"],
            ["Flexible", "Change anything by chat"],
            ["Practical", "Clear workouts, no guesswork"],
            ["Progressive", "Built to keep you moving"],
          ].map(([title, text]) => (
            <div key={title} className="px-4 py-8 text-center md:px-8">
              <p className="text-lg font-semibold">{title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.2em] text-primary">FITNESS WITHOUT THE FRICTION</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Less planning. More showing up.
          </h2>
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

      <section id="how-it-works" className="bg-foreground py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary">
              <Flame className="size-6" />
            </span>
            <p className="mt-8 text-xs font-bold tracking-[0.2em] text-white/50">HOW IT WORKS</p>
            <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              From conversation to your next workout.
            </h2>
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
              {token ? "Open my program" : "Build my free plan"} <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Dumbbell className="size-4 text-primary" /> FitX
          </div>
          <p>Train with clarity. Adapt with confidence.</p>
          <div className="flex items-center gap-1.5"><ShieldCheck className="size-4" /> Built around your needs</div>
        </div>
      </footer>
    </main>
  );
}

function ProductPreview() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-3xl lg:translate-x-8"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.22, ease: "easeOut" }}
    >
      <div className="absolute -inset-10 rounded-full bg-primary/15 blur-3xl" />
      <motion.div
        className="relative overflow-hidden rounded-3xl border bg-white shadow-2xl shadow-primary/10"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-11 items-center gap-1.5 border-b bg-canvas/70 px-4">
          <span className="size-2.5 rounded-full bg-red-300" />
          <span className="size-2.5 rounded-full bg-amber-300" />
          <span className="size-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 rounded-md bg-white px-3 py-1 text-[9px] text-muted-foreground shadow-sm">fitx.app/chat</span>
        </div>
        <div className="grid min-h-[430px] md:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col border-b md:border-r md:border-b-0">
            <div className="flex h-12 items-center gap-2 border-b px-4">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white"><Sparkles className="size-3.5" /></span>
              <div><p className="text-[11px] font-bold">FitX Coach</p><p className="text-[8px] text-muted-foreground">Always ready to adjust</p></div>
            </div>
            <div className="flex-1 space-y-5 p-4 text-[10px] leading-5">
              <div className="max-w-[90%]">
                I created a four-day plan around your home equipment and strength goal.
              </div>
              <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-primary px-3 py-2.5 text-white">
                Can you make Wednesday focused on upper body?
              </div>
              <div className="max-w-[92%]">
                Absolutely. I updated Wednesday and balanced the rest of your week.
              </div>
            </div>
            <div className="m-3 flex h-10 items-center justify-between rounded-xl border px-3 text-[9px] text-muted-foreground shadow-sm">
              Message FitX
              <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-white"><ArrowRight className="size-3" /></span>
            </div>
          </div>

          <div className="bg-canvas/70">
            <div className="flex h-12 items-center justify-between border-b bg-white px-4">
              <div><p className="text-[11px] font-bold">Workout Planner</p><p className="text-[8px] text-muted-foreground">Your live schedule</p></div>
              <CalendarDays className="size-4 text-primary" />
            </div>
            <div className="p-4">
              <div className="flex items-end justify-between">
                <div><p className="text-[9px] font-semibold tracking-wider text-primary">YOUR PLAN</p><h3 className="mt-1 text-base font-semibold">4 day exercise plan</h3></div>
                <p className="text-[9px] text-muted-foreground">2 / 18 completed</p>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border bg-white shadow-sm">
                {workoutDays.map(([name, muscles, exercises], index) => (
                  <div key={name} className="flex items-center gap-2.5 border-b p-3 last:border-0">
                    <span className={`size-2 rounded-full ${index === 0 ? "bg-primary" : "border border-muted-foreground/30"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-semibold">{name}</p>
                      <p className="text-[8px] capitalize text-muted-foreground">{muscles}</p>
                    </div>
                    <div className="text-right text-[8px] text-muted-foreground">
                      <p>{["Wed", "Thu", "Fri", "Sun"][index]}</p><p>{exercises}</p>
                    </div>
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/20 bg-success-soft p-3 text-[9px] font-medium text-success">
                <Check className="size-3.5" /> Your plan adapts as you train
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="absolute -right-3 -bottom-5 hidden items-center gap-3 rounded-2xl border bg-white p-3 shadow-xl sm:flex"
        initial={{ opacity: 0, scale: 0.9, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.75 }}
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-success-soft text-success"><CheckCircle2 className="size-5" /></span>
        <div><p className="text-[10px] font-bold">Workout complete</p><p className="text-[8px] text-muted-foreground">Progress saved automatically</p></div>
      </motion.div>
    </motion.div>
  );
}
