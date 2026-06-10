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
    <div className="sticky bottom-0 border-t bg-white/95 p-4 backdrop-blur">
      <div className="mx-auto max-w-3xl">
        <ChatComposer
          onSend={onSend}
          isPending={isStreaming}
          focusSignal={focusSignal}
          highlighted={Boolean(customQuestion)}
          placeholder={customQuestion ? "Type your answer..." : "Message FitX"}
        />
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          FitX can make mistakes. Use your judgment for health and training
          decisions.
        </p>
      </div>
    </div>
  );
}

