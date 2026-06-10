import { Sparkles } from "lucide-react";
import { ChatStatusIndicator } from "@/features/chat/components/ChatStatusIndicator";
import { MarkdownMessage } from "@/features/chat/components/MarkdownMessage";
import { QuickAnswers } from "@/features/chat/components/QuickAnswers";
import { ChatWidgetRenderer } from "@/features/chat/components/widgets/ChatWidgetRenderer";
import {
  formatHumanMessage,
  getPersistedAnswer,
} from "@/features/chat/helpers/chatMessages";
import type { ChatMessage } from "@/features/chat/types/chat";
import type {
  ActiveChatStatus,
  SendChatMessage,
} from "@/features/chat/types/chatUi";
import { cn } from "@/lib/utils";

interface ChatMessageItemProps {
  message: ChatMessage;
  index: number;
  messages: ChatMessage[];
  isCompact: boolean;
  isStreaming: boolean;
  status: ActiveChatStatus | null;
  answeredWidgets: Record<string, string>;
  onSend: SendChatMessage;
  onSelectQuickAnswer: (
    widgetKey: string,
    question: string,
    answer: string,
  ) => void;
  onRequestCustomAnswer: (widgetKey: string, question: string) => void;
}

export function ChatMessageItem({
  message,
  index,
  messages,
  isCompact,
  isStreaming,
  status,
  answeredWidgets,
  onSend,
  onSelectQuickAnswer,
  onRequestCustomAnswer,
}: ChatMessageItemProps) {
  const isAssistant = message.role === "Assistant";
  const persisted = getPersistedAnswer(message, index, messages);
  const selectedAnswer =
    answeredWidgets[message.id] ??
    persisted.answer ??
    (persisted.hasFollowingAnswer ? "Answered" : undefined);
  const widget = message.content.widget;
  const widgetAnswered =
    Boolean(answeredWidgets[message.id]) ||
    Boolean(persisted.answer) ||
    persisted.hasFollowingAnswer;

  return (
    <div className={cn("flex gap-3", !isAssistant && "justify-end")}>
      {isAssistant && !isCompact && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
          <Sparkles className="size-4" />
        </span>
      )}
      <div
        className={cn(
          "rounded-2xl py-3 text-sm leading-7",
          isCompact ? "max-w-full px-1" : "max-w-[88%] px-4",
          !isAssistant && "rounded-tr-md bg-primary px-4 text-white",
          message.id === "pending-assistant" && "text-muted-foreground",
        )}
      >
        {message.id === "pending-assistant" && status && (
          <div className="mb-2">
            <ChatStatusIndicator status={status.type} label={status.label} />
          </div>
        )}
        {isAssistant ? (
          <MarkdownMessage>{message.content.text}</MarkdownMessage>
        ) : (
          formatHumanMessage(message.content.text)
        )}
        {isAssistant && Boolean(message.content.quickAnswers?.length) && (
          <QuickAnswers
            answers={message.content.quickAnswers ?? []}
            disabled={isStreaming}
            selectedAnswer={selectedAnswer}
            onSelect={(answer) =>
              onSelectQuickAnswer(message.id, message.content.text, answer)
            }
            onCustomAnswer={() =>
              onRequestCustomAnswer(message.id, message.content.text)
            }
          />
        )}
        {isAssistant && widget && widget.type !== "none" && (
          <ChatWidgetRenderer
            widget={widget}
            disabled={isStreaming}
            answered={widgetAnswered}
            onSubmit={(values) =>
              void onSend(values.join(", "), {
                key: message.id,
                question: message.content.text,
              })
            }
          />
        )}
      </div>
    </div>
  );
}

