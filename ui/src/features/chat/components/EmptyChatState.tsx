import { ChatComposer } from "@/features/chat/components/ChatComposer";
import type { SendChatMessage } from "@/features/chat/types/chatUi";
import { APP } from "@/constants/app";
import { Apple, CalendarDays, Sparkles } from "lucide-react";

const STARTER_PROMPTS = [
  {
    prompt: "Build me a weekly workout plan",
    description: "Create a routine around your goals",
    Icon: CalendarDays,
  },
  {
    prompt: "How should I start working out?",
    description: "Get a simple beginner-friendly path",
    Icon: Sparkles,
  },
  {
    prompt: "Suggest a pre-workout meal",
    description: "Find simple food to fuel your training",
    Icon: Apple,
  },
];

const COMPOSER_PLACEHOLDERS = [
  "Message FitX",
  "Create a workout plan for my goals",
  "What should I train today?",
  "Help me improve my nutrition",
  "Adjust my workout schedule",
];

interface EmptyChatStateProps {
  firstName?: string;
  isStreaming: boolean;
  streamError: string | null;
  onSend: SendChatMessage;
}

export function EmptyChatState({
  firstName,
  isStreaming,
  streamError,
  onSend,
}: EmptyChatStateProps) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="bg-primary/12 pointer-events-none absolute -top-52 -left-44 size-[34rem] rounded-full blur-3xl" />
      <div className="bg-primary/10 pointer-events-none absolute -right-52 -bottom-60 size-[40rem] rounded-full blur-3xl" />

      <div className="relative w-full max-w-3xl text-center">
        <div className="border-primary/15 bg-primary-soft/70 shadow-card mx-auto flex size-14 items-center justify-center rounded-2xl border">
          <img src={APP.icon} alt="" className="size-9" />
        </div>
        <p className="text-primary mt-5 text-xs font-semibold tracking-[0.18em] uppercase">
          Your AI fitness coach
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
          How can I help, {firstName ?? "there"}?
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 text-sm leading-6 sm:whitespace-nowrap sm:text-base">
          Ask FitX anything about training, nutrition, or building a routine
          that works for you.
        </p>
        <div className="mx-auto mt-9 max-w-2xl">
          <ChatComposer
            onSend={onSend}
            isPending={isStreaming}
            placeholderOptions={COMPOSER_PLACEHOLDERS}
            large
          />
        </div>
        {streamError && (
          <p className="text-destructive mt-3 text-sm">{streamError}</p>
        )}
        <div className="mx-auto mt-4 grid max-w-2xl gap-2 sm:grid-cols-3">
          {STARTER_PROMPTS.map(({ prompt, description, Icon }) => (
            <button
              key={prompt}
              onClick={() => void onSend(prompt)}
              className="group hover:border-primary/35 hover:bg-primary-soft/50 hover:shadow-card flex cursor-pointer items-center gap-3 rounded-xl border bg-white/80 px-3 py-2.5 text-left transition duration-200 sm:block sm:rounded-2xl sm:p-3 sm:hover:-translate-y-0.5"
            >
              <span className="bg-primary-soft text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold sm:mt-3">
                  {prompt}
                </span>
                <span className="text-muted-foreground mt-1 hidden text-[11px] leading-4 sm:block">
                  {description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
