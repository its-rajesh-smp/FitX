import {
  generatePrompt,
  handleChatErrors,
  useLLMStreaming,
} from "@helpers/chat";
import { ChatThread } from "@models/ChatThread";
import { Message, MessageRole } from "@models/Message";
import { run } from "@openai/agents";
import { SendChatMessageInput } from "@validators/chat/sendChatMessage";
import { Request, Response } from "express";
import { fitXChatAgent } from "../../../agents";
import { db } from "../../../db";

export const sendChatMessage = async (
  req: Request<object, object, SendChatMessageInput>,
  res: Response,
) => {
  const { threadId, message } = req.body;
  const userId = req.user?.id!;

  const { emit, streamAIResponse } = useLLMStreaming(res);

  try {
    const existingChatThread = threadId
      ? await ChatThread.findByIdAndUserId(threadId, userId)
      : null;

    const history = existingChatThread
      ? await Message.getRecent(existingChatThread.id)
      : [];

    const prompt = generatePrompt(history, message);

    emit({ type: "status", status: "thinking", label: "Thinking" });

    const result = await run(fitXChatAgent, prompt, {
      maxTurns: 5,
      stream: true,
    });

    const llmResponse = await streamAIResponse(result);

    const persisted = await db.transaction(async (trx) => {
      const thread = existingChatThread
        ? existingChatThread
        : await ChatThread.create({ userId }, trx);

      await Message.create(
        {
          userId,
          threadId: thread.id,
          role: MessageRole.Human,
          content: { text: message },
        },
        trx,
      );

      const newLLMResponse = await Message.create(
        {
          userId,
          threadId: thread.id,
          role: MessageRole.Assistant,
          content: { text: llmResponse },
        },
        trx,
      );

      // await ChatThread.update(
      //   thread.id,
      //   {
      //     threadMemory: {
      //       lastUserMessage: message,
      //       lastAssistantMessage: llmResponse,
      //     },
      //   },
      //   trx,
      // );

      return { thread, newLLMResponse };
    });

    emit({
      type: "completed",
      thread: persisted.thread,
      message: persisted.newLLMResponse,
    });

    return res.end();
  } catch (error) {
    handleChatErrors(error, emit);
    return res.end();
  }
};
