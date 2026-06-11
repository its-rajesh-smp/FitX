import { run } from "@openai/agents";
import { Response } from "express";
import { fitXChatAgent } from "../../agents";
import { ChatThread } from "../../db/models/ChatThread";
import { Message } from "../../db/models/Message";
import { User } from "../../db/models/User";

const formatHistory = (messages: Message[]): string => {
  return messages
    .map((message) => {
      let text = `${message.role === "Human" ? "User" : "Assistant"}: ${message.content.text}`;

      if (message.content?.widget) {
        text += ` widget_shown: ${message.content.widget.type}`;
      }

      return text;
    })
    .join("\n");
};

export interface LocalDateContext {
  date: string;
  weekday: string;
  dayNumber: number;
  timeZone: string;
}

export const getLocalDateContext = (timeZone: string): LocalDateContext => {
  const now = new Date();
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    dateParts.find((item) => item.type === type)?.value ?? "";
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
  }).format(now);

  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    weekday,
    dayNumber: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].indexOf(weekday),
    timeZone,
  };
};

export const generatePrompt = (
  history: Message[],
  newMessage: string,
  user: User,
  localDate: LocalDateContext,
  thread?: ChatThread,
): string => {
  const historyText = formatHistory(history);
  const userDetails = JSON.stringify(user.details ?? {});
  const threadSummary =
    (thread && ChatThread.getSummary(thread)) ??
    "No short-term thread summary yet.";

  return `
Current local date: ${localDate.date}
Current local weekday: ${localDate.weekday}
Current dayNumber: ${localDate.dayNumber}


Important user details:
${userDetails}


Short-term chat thread summary:
${threadSummary}

Previous conversations:
${historyText || "No recent messages."}


New User's Message: ${newMessage}`;
};

export type ChatStreamStatus =
  | "thinking"
  | "responding"
  | "getting_exercises"
  | "getting_plan"
  | "generating_plan"
  | "updating_plan";

export type ChatStreamEvent =
  | { type: "status"; status: ChatStreamStatus; label: string }
  | { type: "delta"; text: string }
  | { type: "text_snapshot"; text: string }
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

const extractPartialJsonText = (json: string): string => {
  const textKey = json.match(/"text"\s*:\s*"/);
  if (!textKey?.index && textKey?.index !== 0) return "";

  const start = textKey.index + textKey[0].length;
  let escaped = false;
  let encoded = "";

  for (let index = start; index < json.length; index += 1) {
    const character = json[index];

    if (!escaped && character === '"') break;
    encoded += character;

    if (escaped) escaped = false;
    else if (character === "\\") escaped = true;
  }

  if (escaped) return "";

  try {
    return JSON.parse(`"${encoded}"`);
  } catch {
    return "";
  }
};

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
    let rawOutput = "";
    let streamedText = "";

    for await (const event of result) {
      if (
        event.type !== "raw_model_stream_event" ||
        event.data.type !== "output_text_delta"
      ) {
        continue;
      }

      rawOutput += event.data.delta;
      const nextText = extractPartialJsonText(rawOutput);
      if (!nextText.startsWith(streamedText)) continue;

      const delta = nextText.slice(streamedText.length);
      if (!delta) continue;

      if (!streamedText) {
        emit({
          type: "status",
          status: "responding",
          label: "Writing response",
        });
      }
      streamedText = nextText;
      emit({ type: "delta", text: delta });
    }

    await result.completed;

    if (!result.finalOutput) {
      throw new Error("EMPTY_CHAT_RESPONSE");
    }

    if (!streamedText) {
      emit({ type: "status", status: "responding", label: "Writing response" });
    }
    emit({ type: "text_snapshot", text: result.finalOutput.text });

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
