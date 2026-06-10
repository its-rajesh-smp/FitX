import { ChatComposer } from "@/features/chat/components/ChatComposer";
import type { SendChatMessage } from "@/features/chat/types/chatUi";
import { APP } from "@/constants/app";

const STARTER_PROMPTS = [
  "Build me a weekly strength plan",
  "How should I start working out?",
  "What should I workout today?",
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
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl text-center">
        <img src={APP.icon} alt="" className="mx-auto size-8" />
        <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          How can I help, {firstName ?? "there"}?
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-[15px] leading-6">
          Ask FitX anything about training, nutrition, or building a routine
          that works for you.
        </p>
        <div className="mt-8">
          <ChatComposer onSend={onSend} isPending={isStreaming} large />
        </div>
        {streamError && (
          <p className="text-destructive mt-3 text-sm">{streamError}</p>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => void onSend(prompt)}
              className="text-muted-foreground hover:border-primary/50 hover:bg-primary-soft/40 hover:text-primary rounded-full border px-4 py-2 text-xs transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
