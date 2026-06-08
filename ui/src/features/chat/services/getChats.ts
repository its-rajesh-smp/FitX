import { api, type ApiEnvelope } from "@/libs/api";
import type { ChatMessage, ChatThread } from "@/features/chat/types/chat";

export const getChats = async (): Promise<{ thread: ChatThread | null; messages: ChatMessage[] }> => {
  const response = await api.get<ApiEnvelope<{ thread: ChatThread | null; messages: ChatMessage[] }>>("/chats");
  return response.data.data;
};
