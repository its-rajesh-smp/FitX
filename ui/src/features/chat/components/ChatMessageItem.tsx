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
  onOpenPlan: () => void;
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
  onOpenPlan,
  onSend,
  onSelectQuickAnswer,
  onRequestCustomAnswer,
}: ChatMessageItemProps) {
  const isAssistant = message.role === "Assistant";
  const isPendingAssistant = message.id.startsWith("pending-assistant-");
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
  const hasPlanWidget = isAssistant && widget?.type === "user_plan";

  return (
    <div className={cn("flex gap-3", !isAssistant && "justify-end")}>
      {isAssistant && !isCompact && (
        <span className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-lg text-white">
          <Sparkles className="size-4" />
        </span>
      )}
      <div
        className={cn(
          "rounded-2xl py-3 text-sm leading-7",
          isCompact ? "max-w-full px-1" : "max-w-[88%] px-4",
          !isAssistant && "bg-primary rounded-tr-md px-4 text-white",
          isPendingAssistant && "text-muted-foreground",
          hasPlanWidget &&
            (isCompact ? "w-full max-w-full" : "w-full max-w-xl"),
        )}
      >
        {isPendingAssistant && status && (
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
            onOpenPlan={onOpenPlan}
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
