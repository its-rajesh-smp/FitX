import type { ChatStatus } from "@/features/chat/services/streamChatMessage";

export interface AnswerContext {
  key: string;
  question: string;
}

export interface ActiveChatStatus {
  type: ChatStatus;
  label: string;
}

export type SendChatMessage = (
  text: string,
  answerContext?: AnswerContext | null,
) => Promise<void>;

