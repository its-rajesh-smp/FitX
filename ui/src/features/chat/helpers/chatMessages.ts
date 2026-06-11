import type { ChatMessage } from "@/features/chat/types/chat";

const ANSWER_PATTERN = /^Question: (.+)\nAnswer: (.+)$/s;

export const formatHumanMessage = (text: string) =>
  text.match(ANSWER_PATTERN)?.[2] ?? text;

export const getPersistedAnswer = (
  message: ChatMessage,
  index: number,
  messages: ChatMessage[],
) => {
  const nextHumanMessage = messages
    .slice(index + 1)
    .find((item) => item.role === "Human");
  const response = nextHumanMessage?.content.text.match(ANSWER_PATTERN);

  return {
    answer: response?.[1] === message.content.text ? response[2] : undefined,
    hasFollowingAnswer: Boolean(nextHumanMessage),
  };
};

