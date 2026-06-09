import { ChatThread } from "@models/ChatThread";
import { Message } from "@models/Message";
import { run } from "@openai/agents";
import { Response } from "express";
import { fitXChatAgent } from "../../agents";
import { User } from "@models/User";

const formatHistory = (messages: Message[]): string => {
  return messages
    .map(
      (message) =>
        `${message.role === "Human" ? "User" : "FitX"}: ${message.content.text}`,
    )
    .join("\n");
};

export const generatePrompt = (
  history: Message[],
  newMessage: string,
  user: User,
  thread?: ChatThread,
): string => {
  const historyText = formatHistory(history);
  const userDetails = JSON.stringify(user.details ?? {});
  const threadSummary =
    (thread && ChatThread.getSummary(thread)) ??
    "No short-term thread summary yet.";
  const currentDate = new Date().toISOString().slice(0, 10);

  return `Current date:
${currentDate}

Important user details:
${userDetails}

Short-term thread summary:
${threadSummary}

Latest conversation history:
${historyText || "No recent messages."}

User: ${newMessage}`;
};

export type ChatStreamStatus =
  | "thinking"
  | "responding"
  | "getting_options"
  | "getting_exercises"
  | "getting_plan"
  | "generating_plan"
  | "updating_plan";

export type ChatStreamEvent =
  | { type: "status"; status: ChatStreamStatus; label: string }
  | { type: "delta"; text: string }
  | { type: "plan_updated" }
  | { type: "completed"; thread: ChatThread; message: Message };

export type ChatEventEmitter = (
  event: ChatStreamEvent | { type: "error"; message: string },
) => void;

export interface FitXAgentContext {
  userId: string;
  emit: ChatEventEmitter;
}

type FitXStreamedRunResult = Awaited<
  ReturnType<typeof run<typeof fitXChatAgent, FitXAgentContext>>
>;

export const useLLMStreaming = (res: Response) => {
  let planMutated = false;
  res.status(200);
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const emit: ChatEventEmitter = (event) => {
    if (
      event.type === "status" &&
      (event.status === "generating_plan" || event.status === "updating_plan")
    ) {
      planMutated = true;
    }
    res.write(`${JSON.stringify(event)}\n`);
  };

  const streamAIResponse = async (result: FitXStreamedRunResult) => {
    for await (const _event of result) {
      // Consume the stream while tools emit their own request-specific statuses.
    }

    await result.completed;

    if (!result.finalOutput) {
      throw new Error("EMPTY_CHAT_RESPONSE");
    }

    emit({ type: "status", status: "responding", label: "Writing response" });
    emit({ type: "delta", text: result.finalOutput.text });

    return result.finalOutput;
  };

  return { emit, streamAIResponse, didPlanMutate: () => planMutated };
};

export const handleChatErrors = (error: unknown, emit: ChatEventEmitter) => {
  if (error instanceof Error && error.message === "CHAT_THREAD_NOT_FOUND") {
    console.error("Chat thread not found:", error);
    emit({ type: "error", message: "Chat thread not found" });
    return;
  } else {
    console.error("FitX chat generation failed:", error);
    emit({
      type: "error",
      message: "FitX is unavailable right now. Please try again shortly.",
    });
    return;
  }
};
