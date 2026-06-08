import { ChatThread } from "@models/ChatThread";
import { Message } from "@models/Message";
import { run } from "@openai/agents";
import { Response } from "express";
import { fitXChatAgent } from "../../agents";

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
): string => {
  const historyText = formatHistory(history);

  return historyText
    ? `Conversation so far:\n${historyText}\n\nUser: ${newMessage}`
    : newMessage;
};

export type ChatStreamStatus =
  | "thinking"
  | "responding"
  | "generating_plan"
  | "searching_exercises"
  | "saving_plan";

export type ChatStreamEvent =
  | { type: "status"; status: ChatStreamStatus; label: string }
  | { type: "delta"; text: string }
  | { type: "completed"; thread: ChatThread; message: Message };

type FitXStreamedRunResult = Awaited<
  ReturnType<typeof run<typeof fitXChatAgent>>
>;

export const useLLMStreaming = (res: Response) => {
  res.status(200);
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const emit = (
    event: ChatStreamEvent | { type: "error"; message: string },
  ) => {
    res.write(`${JSON.stringify(event)}\n`);
  };

  const streamAIResponse = async (result: FitXStreamedRunResult) => {
    const textStream = result.toTextStream({ compatibleWithNodeStreams: true });
    let response = "";
    let hasStartedResponding = false;

    for await (const chunk of textStream) {
      const text = chunk.toString();

      if (!hasStartedResponding) {
        emit({
          type: "status",
          status: "responding",
          label: "Writing response",
        });
        hasStartedResponding = true;
      }

      response += text;
      emit({ type: "delta", text });
    }

    await result.completed;

    if (!response.trim()) {
      throw new Error("EMPTY_CHAT_RESPONSE");
    }

    return response;
  };

  return { emit, streamAIResponse };
};

export const handleChatErrors = (error: unknown, emit: any) => {
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
