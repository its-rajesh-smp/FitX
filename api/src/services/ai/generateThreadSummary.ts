import { run } from "@openai/agents";
import { chatThreadSummaryAgent } from "../../agents";
import { ChatThread } from "../../db/models/ChatThread";
import { Message, MessageRole } from "../../db/models/Message";

const THREAD_SUMMARY_BATCH_SIZE = 10;

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
  try {
    const summarizedMessageCount = ChatThread.getSummarizedMessageCount(thread);
    const totalMessageCount = await Message.countByThreadId(thread.id);

    if (
      totalMessageCount - summarizedMessageCount <
      THREAD_SUMMARY_BATCH_SIZE
    ) {
      return thread;
    }

    const nextMessageBatch = await Message.getBatchAfterMessageCount(
      thread.id,
      summarizedMessageCount,
      THREAD_SUMMARY_BATCH_SIZE,
    );

    const result = await run(
      chatThreadSummaryAgent,
      `Existing thread summary:
${ChatThread.getSummary(thread) ?? "No existing summary."}

New conversation batch:
${formatMessages(nextMessageBatch)}`,
      { maxTurns: 1 },
    );

    if (!result.finalOutput) {
      throw new Error("THREAD_SUMMARY_EMPTY");
    }

    await ChatThread.update(thread.id, {
      threadMemory: {
        summary: result.finalOutput.summary,
        summarizedMessageCount:
          summarizedMessageCount + THREAD_SUMMARY_BATCH_SIZE,
      },
    });
  } catch (error) {
    console.log("Error generating thread summary:", error);
    return;
  }
};
