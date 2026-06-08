import { memoryLlmModel } from "@config/llm";
import { ChatThread } from "@models/ChatThread";
import { Message, MessageRole } from "@models/Message";
import { Agent, run } from "@openai/agents";
import { z } from "zod";

const THREAD_SUMMARY_BATCH_SIZE = 10;

const threadSummarySchema = z.object({
  summary: z.string().min(1).max(4000),
});

const threadSummaryAgent = new Agent({
  name: "FitX Thread Summarizer",
  model: memoryLlmModel,
  outputType: threadSummarySchema,
  instructions: `Maintain a compact short-term summary of a FitX chat thread.

Preserve:
- The user's current intent and open questions.
- Important decisions, advice already given, and unresolved next steps.
- Context needed to continue the conversation naturally.

Do not copy the conversation verbatim. Remove greetings, repetition, and obsolete details.
Return one concise summary under 1200 words.`,
});

const formatMessages = (messages: Message[]) =>
  messages
    .map(
      (message) =>
        `${message.role === MessageRole.Human ? "User" : "FitX"}: ${message.content.text}`,
    )
    .join("\n");

export const generateThreadSummary = async (
  thread: ChatThread,
): Promise<ChatThread | undefined> => {
  const summarizedMessageCount = ChatThread.getSummarizedMessageCount(thread);
  const totalMessageCount = await Message.countByThreadId(thread.id);

  if (totalMessageCount - summarizedMessageCount < THREAD_SUMMARY_BATCH_SIZE) {
    return thread;
  }

  const nextMessageBatch = await Message.getBatchAfterMessageCount(
    thread.id,
    summarizedMessageCount,
    THREAD_SUMMARY_BATCH_SIZE,
  );

  const result = await run(
    threadSummaryAgent,
    `Existing thread summary:
${ChatThread.getSummary(thread) ?? "No existing summary."}

New conversation batch:
${formatMessages(nextMessageBatch)}`,
    { maxTurns: 1 },
  );

  if (!result.finalOutput) {
    throw new Error("THREAD_SUMMARY_EMPTY");
  }

  return await ChatThread.update(thread.id, {
    threadMemory: {
      ...(thread.threadMemory ?? {}),
      summary: result.finalOutput.summary,
      summarizedMessageCount:
        summarizedMessageCount + THREAD_SUMMARY_BATCH_SIZE,
    },
  });
};
