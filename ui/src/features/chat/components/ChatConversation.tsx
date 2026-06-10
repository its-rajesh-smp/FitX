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
  hasPlan: boolean;
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
  hasPlan,
  onOpenPlan,
  onSend,
  onSelectQuickAnswer,
  onRequestCustomAnswer,
}: ChatConversationProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasPositionedInitialMessages = useRef(false);
  const latestAssistantIndex = messages.findLastIndex(
    (message) =>
      message.role === "Assistant" &&
      !message.id.startsWith("pending-assistant-"),
  );

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
              showPlanShortcut={hasPlan && index === latestAssistantIndex}
              onOpenPlan={onOpenPlan}
              onSend={onSend}
              onSelectQuickAnswer={onSelectQuickAnswer}
              onRequestCustomAnswer={onRequestCustomAnswer}
            />
          ))}
          {streamError && (
            <p className="text-center text-sm text-destructive">{streamError}</p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
