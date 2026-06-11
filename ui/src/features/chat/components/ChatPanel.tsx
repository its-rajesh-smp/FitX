import type { RefObject } from "react";
import { ChatComposerDock } from "@/features/chat/components/ChatComposerDock";
import { ChatConversation } from "@/features/chat/components/ChatConversation";
import { EmptyChatState } from "@/features/chat/components/EmptyChatState";
import type { ChatMessage } from "@/features/chat/types/chat";
import type {
  ActiveChatStatus,
  AnswerContext,
  SendChatMessage,
} from "@/features/chat/types/chatUi";

interface ChatPanelProps {
  contentRef: RefObject<HTMLElement | null>;
  firstName?: string;
  messages: ChatMessage[];
  isCompact: boolean;
  isStreaming: boolean;
  status: ActiveChatStatus | null;
  streamError: string | null;
  answeredWidgets: Record<string, string>;
  customQuestion: AnswerContext | null;
  composerFocusSignal: number;
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

export function ChatPanel({
  contentRef,
  firstName,
  messages,
  isCompact,
  isStreaming,
  status,
  streamError,
  answeredWidgets,
  customQuestion,
  composerFocusSignal,
  hasPlan,
  onOpenPlan,
  onSend,
  onSelectQuickAnswer,
  onRequestCustomAnswer,
}: ChatPanelProps) {
  const isEmpty = messages.length === 0;

  return (
    <main
      ref={contentRef}
      className="flex min-h-0 min-w-0 flex-1 flex-col bg-white"
    >
      {isEmpty ? (
        <EmptyChatState
          firstName={firstName}
          isStreaming={isStreaming}
          streamError={streamError}
          onSend={onSend}
        />
      ) : (
        <ChatConversation
          messages={messages}
          isCompact={isCompact}
          isStreaming={isStreaming}
          status={status}
          streamError={streamError}
          answeredWidgets={answeredWidgets}
          hasPlan={hasPlan}
          onOpenPlan={onOpenPlan}
          onSend={onSend}
          onSelectQuickAnswer={onSelectQuickAnswer}
          onRequestCustomAnswer={onRequestCustomAnswer}
        />
      )}
      {!isEmpty && (
        <ChatComposerDock
          isStreaming={isStreaming}
          customQuestion={customQuestion}
          focusSignal={composerFocusSignal}
          onSend={onSend}
        />
      )}
    </main>
  );
}
