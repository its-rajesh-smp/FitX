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

  return `Important user details:
${userDetails}

Short-term thread summary:
${threadSummary}

Latest conversation history:
${historyText || "No recent messages."}

User: ${newMessage}`;
};

export type ChatStreamStatus = "thinking" | "responding";

export type ChatStreamEvent =
  | { type: "status"; status: ChatStreamStatus; label: string }
  | { type: "delta"; text: string }
  | { type: "completed"; thread: ChatThread; message: Message };

export type ChatEventEmitter = (
  event: ChatStreamEvent | { type: "error"; message: string },
) => void;

type FitXStreamedRunResult = Awaited<
  ReturnType<typeof run<typeof fitXChatAgent>>
>;

const extractPartialJsonString = (
  json: string,
  field: string,
): string | undefined => {
  const fieldMatch = new RegExp(`"${field}"\\s*:\\s*"`).exec(json);
  if (!fieldMatch) return;

  let value = "";
  let index = fieldMatch.index + fieldMatch[0].length;

  while (index < json.length) {
    const character = json[index];
    if (character === '"') break;

    if (character !== "\\") {
      value += character;
      index += 1;
      continue;
    }

    const escape = json[index + 1];
    if (!escape) break;

    const simpleEscapes: Record<string, string> = {
      '"': '"',
      "\\": "\\",
      "/": "/",
      b: "\b",
      f: "\f",
      n: "\n",
      r: "\r",
      t: "\t",
    };

    if (escape === "u") {
      const code = json.slice(index + 2, index + 6);
      if (!/^[0-9a-fA-F]{4}$/.test(code)) break;
      value += String.fromCharCode(Number.parseInt(code, 16));
      index += 6;
      continue;
    }

    if (!(escape in simpleEscapes)) break;
    value += simpleEscapes[escape];
    index += 2;
  }

  return value;
};

export const useLLMStreaming = (res: Response) => {
  res.status(200);
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const emit: ChatEventEmitter = (event) => {
    res.write(`${JSON.stringify(event)}\n`);
  };

  const streamAIResponse = async (result: FitXStreamedRunResult) => {
    const textStream = result.toTextStream({ compatibleWithNodeStreams: true });
    let rawOutput = "";
    let streamedText = "";
    let hasStartedResponding = false;

    for await (const chunk of textStream) {
      rawOutput += chunk.toString();
      const currentText = extractPartialJsonString(rawOutput, "text");
      if (currentText === undefined || currentText.length <= streamedText.length) {
        continue;
      }

      if (!hasStartedResponding) {
        emit({ type: "status", status: "responding", label: "Writing response" });
        hasStartedResponding = true;
      }

      const delta = currentText.slice(streamedText.length);
      streamedText = currentText;
      emit({ type: "delta", text: delta });
    }

    await result.completed;

    if (!result.finalOutput) {
      throw new Error("EMPTY_CHAT_RESPONSE");
    }

    if (result.finalOutput.text.length > streamedText.length) {
      if (!hasStartedResponding) {
        emit({ type: "status", status: "responding", label: "Writing response" });
      }
      emit({
        type: "delta",
        text: result.finalOutput.text.slice(streamedText.length),
      });
    }

    return result.finalOutput;
  };

  return { emit, streamAIResponse };
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
