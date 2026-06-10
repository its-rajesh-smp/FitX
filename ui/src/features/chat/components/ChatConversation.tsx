import { useLayoutEffect, useRef } from "react";
import { ChatMessageItem } from "@/features/chat/components/ChatMessageItem";
import type { ChatMessage } from "@/features/chat/types/chat";
import type {
  ActiveChatStatus,
  SendChatMessage,
} from "@/features/chat/types/chatUi";

interface ChatConversationProps {
  messages: ChatMessage[];
  isCompact: boolean;
  isStreaming: boolean;
  status: ActiveChatStatus | null;
  streamError: string | null;
  answeredWidgets: Record<string, string>;
  onOpenPlan: () => void;
  onSend: SendChatMessage;
  onSelectQuickAnswer: (
    widgetKey: string,
    question: string,
    answer: string,
  ) => void;
  onRequestCustomAnswer: (widgetKey: string, question: string) => void;
}

export function ChatConversation({
  messages,
  isCompact,
  isStreaming,
  status,
  streamError,
  answeredWidgets,
  onOpenPlan,
  onSend,
  onSelectQuickAnswer,
  onRequestCustomAnswer,
}: ChatConversationProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasPositionedInitialMessages = useRef(false);

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: hasPositionedInitialMessages.current ? "smooth" : "instant",
    });
    hasPositionedInitialMessages.current = true;
  }, [messages]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="space-y-7">
          {messages.map((message, index) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              index={index}
              messages={messages}
              isCompact={isCompact}
              isStreaming={isStreaming}
              status={status}
              answeredWidgets={answeredWidgets}
              onOpenPlan={onOpenPlan}
              onSend={onSend}
              onSelectQuickAnswer={onSelectQuickAnswer}
              onRequestCustomAnswer={onRequestCustomAnswer}
            />
          ))}
          {streamError && (
            <p className="text-destructive text-center text-sm">
              {streamError}
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
