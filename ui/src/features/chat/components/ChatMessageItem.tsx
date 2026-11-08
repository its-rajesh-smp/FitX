import { BrandMark } from "@/components/ui/BrandMark";
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
      {isAssistant && !isCompact && <BrandMark size="sm" className="mt-1" />}
      <div
        className={cn(
          "text-[15px] leading-7",
          isAssistant && (isCompact ? "max-w-full" : "max-w-[88%] pt-0.5"),
          !isAssistant &&
            "bg-secondary max-w-[85%] rounded-[20px] rounded-br-md px-4 py-2.5 leading-6",
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
