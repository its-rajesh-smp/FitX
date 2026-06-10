import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import type { ChatMessage, ChatThread } from "@/features/chat/types/chat";

export type ChatStatus =
  | "thinking"
  | "responding"
  | "getting_exercises"
  | "getting_plan"
  | "generating_plan"
  | "updating_plan";

export type ChatStreamEvent =
  | { type: "status"; status: ChatStatus; label: string }
  | { type: "delta"; text: string }
  | { type: "text_snapshot"; text: string }
  | { type: "plan_updated" }
  | { type: "completed"; thread: ChatThread; message: ChatMessage }
  | { type: "error"; message: string };

export async function streamChatMessage(
  payload: { message: string; threadId?: string; timeZone: string },
  onEvent: (event: ChatStreamEvent) => void,
): Promise<void> {
  const token = useAuthStore.getState().token;
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"}/chats`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok || !response.body) {
    throw new Error("Unable to start chat stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    lines.filter(Boolean).forEach((line) => onEvent(JSON.parse(line) as ChatStreamEvent));
    if (done) break;
  }

  if (buffer.trim()) onEvent(JSON.parse(buffer) as ChatStreamEvent);
}
