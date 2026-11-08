import { ChatComposer } from "@/features/chat/components/ChatComposer";
import type { SendChatMessage } from "@/features/chat/types/chatUi";
import { cn } from "@/lib/utils";
import { Apple, CalendarDays, Sparkles } from "lucide-react";

// Pastel trios group the starters without turning the row into a rainbow.
const STARTER_PROMPTS = [
  {
    prompt: "Build me a weekly workout plan",
    description: "A routine around your goals and gear",
    Icon: CalendarDays,
    tone: "border-violet-edge bg-violet-tint",
    ink: "text-violet-ink",
  },
  {
    prompt: "How should I start working out?",
    description: "A simple, beginner-friendly path",
    Icon: Sparkles,
    tone: "border-iris-edge bg-iris-tint",
    ink: "text-iris-ink",
  },
  {
    prompt: "Suggest a pre-workout meal",
    description: "Simple food to fuel your training",
    Icon: Apple,
    tone: "border-rose-edge bg-rose-tint",
    ink: "text-rose-ink",
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
    <div className="from-violet-tint/70 to-background flex flex-1 items-center justify-center overflow-y-auto bg-linear-to-b via-white px-4 py-10 sm:px-6">
      <div className="w-full max-w-2xl">
        <h2 className="animate-rise text-center text-[36px] leading-[1.05] font-normal tracking-[-0.035em] text-balance sm:text-[52px]">
          How can I help, {firstName ?? "there"}?
        </h2>
        <p className="text-muted-foreground animate-rise mx-auto mt-4 max-w-xl text-center text-[15px] text-pretty [animation-delay:75ms] sm:text-base">
          Ask about training, recovery or food, or let FitX build your week.
        </p>

        <div className="animate-rise mt-9 [animation-delay:150ms]">
          <ChatComposer
            onSend={onSend}
            isPending={isStreaming}
            placeholderOptions={COMPOSER_PLACEHOLDERS}
            large
          />
        </div>
        {streamError && (
          <p className="text-destructive mt-3 text-center text-sm">
            {streamError}
          </p>
        )}

        <div className="animate-rise mt-4 grid gap-2.5 [animation-delay:225ms] sm:grid-cols-3 sm:gap-3">
          {STARTER_PROMPTS.map(({ prompt, description, Icon, tone, ink }) => (
            <button
              key={prompt}
              type="button"
              disabled={isStreaming}
              onClick={() => void onSend(prompt)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition duration-200 hover:shadow-card disabled:opacity-60 sm:flex-col sm:items-start sm:justify-start sm:gap-0 sm:p-4 sm:hover:-translate-y-0.5",
                tone,
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/85",
                  ink,
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] leading-5 font-semibold sm:mt-3">
                  {prompt}
                </span>
                <span className="text-muted-foreground mt-0.5 hidden text-[12px] leading-4 sm:block">
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
