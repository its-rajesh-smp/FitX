import { ChatComposer } from "@/features/chat/components/ChatComposer";
import type { AnswerContext, SendChatMessage } from "@/features/chat/types/chatUi";

interface ChatComposerDockProps {
  isStreaming: boolean;
  customQuestion: AnswerContext | null;
  focusSignal: number;
  onSend: SendChatMessage;
}

export function ChatComposerDock({
  isStreaming,
  customQuestion,
  focusSignal,
  onSend,
}: ChatComposerDockProps) {
  return (
    <div className="sticky bottom-0 bg-linear-to-t from-white via-white to-white/0 px-4 pt-3 pb-3 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <ChatComposer
          onSend={onSend}
          isPending={isStreaming}
          focusSignal={focusSignal}
          highlighted={Boolean(customQuestion)}
          placeholder={customQuestion ? "Type your answer..." : "Message FitX"}
        />
        <p className="text-muted-foreground/80 mt-2 text-center text-[11px]">
          FitX can make mistakes. Use your judgment for health and training
          decisions.
        </p>
      </div>
    </div>
  );
}

