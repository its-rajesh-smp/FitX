import { ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { workoutDays } from "@/features/landing/data/landing";

export function ProductPreview() {
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
        <BrowserBar />
        <div className="grid min-h-[430px] md:grid-cols-[0.85fr_1.15fr]">
          <ChatPreview />
          <PlannerPreview />
        </div>
      </motion.div>
      <WorkoutCompleteBadge />
    </motion.div>
  );
}

function BrowserBar() {
  return (
    <div className="flex h-11 items-center gap-1.5 border-b bg-canvas/70 px-4">
      {["bg-red-300", "bg-amber-300", "bg-emerald-300"].map((color) => (
        <span key={color} className={`size-2.5 rounded-full ${color}`} />
      ))}
      <span className="ml-3 rounded-md bg-white px-3 py-1 text-[9px] text-muted-foreground shadow-sm">fitx.app/chat</span>
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="flex flex-col border-b md:border-r md:border-b-0">
      <div className="flex h-12 items-center gap-2 border-b px-4">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white">
          <Sparkles className="size-3.5" />
        </span>
        <div>
          <p className="text-[11px] font-bold">FitX Coach</p>
          <p className="text-[8px] text-muted-foreground">Always ready to adjust</p>
        </div>
      </div>
      <div className="flex-1 space-y-5 p-4 text-[10px] leading-5">
        <div className="max-w-[90%]">I created a four-day plan around your home equipment and strength goal.</div>
        <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-primary px-3 py-2.5 text-white">
          Can you make Wednesday focused on upper body?
        </div>
        <div className="max-w-[92%]">Absolutely. I updated Wednesday and balanced the rest of your week.</div>
      </div>
      <div className="m-3 flex h-10 items-center justify-between rounded-xl border px-3 text-[9px] text-muted-foreground shadow-sm">
        Message FitX
        <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-white">
          <ArrowRight className="size-3" />
        </span>
      </div>
    </div>
  );
}

function PlannerPreview() {
  return (
    <div className="bg-canvas/70">
      <div className="flex h-12 items-center justify-between border-b bg-white px-4">
        <div>
          <p className="text-[11px] font-bold">Workout Planner</p>
          <p className="text-[8px] text-muted-foreground">Your live schedule</p>
        </div>
        <CalendarDays className="size-4 text-primary" />
      </div>
      <div className="p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-wider text-primary">YOUR PLAN</p>
            <h3 className="mt-1 text-base font-semibold">4 day exercise plan</h3>
          </div>
          <p className="text-[9px] text-muted-foreground">2 / 18 completed</p>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border bg-white shadow-sm">
          {workoutDays.map(([name, muscles, exercises, day], index) => (
            <div key={name} className="flex items-center gap-2.5 border-b p-3 last:border-0">
              <span className={`size-2 rounded-full ${index === 0 ? "bg-primary" : "border border-muted-foreground/30"}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold">{name}</p>
                <p className="text-[8px] capitalize text-muted-foreground">{muscles}</p>
              </div>
              <div className="text-right text-[8px] text-muted-foreground">
                <p>{day}</p>
                <p>{exercises}</p>
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
  );
}

function WorkoutCompleteBadge() {
  return (
    <motion.div
      className="absolute -right-3 -bottom-5 hidden items-center gap-3 rounded-2xl border bg-white p-3 shadow-xl sm:flex"
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.75 }}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-success-soft text-success">
        <CheckCircle2 className="size-5" />
      </span>
      <div>
        <p className="text-[10px] font-bold">Workout complete</p>
        <p className="text-[8px] text-muted-foreground">Progress saved automatically</p>
      </div>
    </motion.div>
  );
}

