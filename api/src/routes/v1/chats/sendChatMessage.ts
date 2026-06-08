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
import { User } from "@models/User";
import { generateThreadSummary, updateUserDetails } from "../../../services/ai";

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
      ? await Message.getRecent(existingChatThread.id, 10)
      : [];

    const user = await User.findById(userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    const userWithUpdatedDetails = await updateUserDetails({
      user,
      message,
    }).catch((error) => {
      console.error("FitX user details update failed:", error);
      return user;
    });

    const prompt = generatePrompt(
      history,
      message,
      userWithUpdatedDetails,
      existingChatThread ?? undefined,
    );

    emit({ type: "status", status: "thinking", label: "Thinking" });

    const result = await run(fitXChatAgent, prompt, {
      maxTurns: 5,
      stream: true,
    });

    const llmResponse = await streamAIResponse(result);

    const persisted = await db.transaction(async (trx) => {
      const thread =
        existingChatThread ??
        (await ChatThread.create({ userId, threadMemory: {} }, trx));

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

      await ChatThread.touch(thread.id);

      return { thread, newLLMResponse };
    });

    await generateThreadSummary(persisted.thread).catch((error) => {
      console.error("FitX thread summary update failed:", error);
      return persisted.thread;
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
