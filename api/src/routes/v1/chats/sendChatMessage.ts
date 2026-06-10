import {
  generatePrompt,
  getLocalDateContext,
  handleChatErrors,
  useLLMStreaming,
} from "../../../helpers/chat";
import { ChatThread } from "../../../db/models/ChatThread";
import { Message, MessageRole } from "../../../db/models/Message";
import { User } from "../../../db/models/User";
import { run } from "@openai/agents";
import { SendChatMessageInput } from "../../../validators/chat/sendChatMessage";
import { Request, Response } from "express";
import { fitXChatAgent } from "../../../agents";
import { db } from "../../../db";
import { generateThreadSummary, updateUserDetails } from "../../../services/ai";

export const sendChatMessage = async (
  req: Request<object, object, SendChatMessageInput>,
  res: Response,
) => {
  const { threadId, message, timeZone } = req.body;
  const userId = req.user?.id!;

  const { emit, streamAIResponse, didPlanMutate } = useLLMStreaming(res);

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
    });

    const localDate = getLocalDateContext(timeZone);
    const prompt = generatePrompt(
      history,
      message,
      userWithUpdatedDetails,
      localDate,
      existingChatThread ?? undefined,
    );
    emit({ type: "status", status: "thinking", label: "Thinking" });

    const result = await run(fitXChatAgent, prompt, {
      context: { userId, currentDayNumber: localDate.dayNumber, emit },
      maxTurns: 20,
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
          content: {
            text: llmResponse.text,
            ...(llmResponse.quickAnswers.length && {
              quickAnswers: llmResponse.quickAnswers,
            }),
            ...(llmResponse.widget && {
              widget: llmResponse.widget,
            }),
          },
        },
        trx,
      );

      await ChatThread.touch(thread.id);

      return { thread, newLLMResponse };
    });

    emit({
      type: "completed",
      thread: persisted.thread,
      message: persisted.newLLMResponse,
    });
    if (didPlanMutate()) {
      emit({ type: "plan_updated" });
    }

    res.end();

    void generateThreadSummary(persisted.thread).catch((error) => {
      console.error("FitX thread summary update failed:", error);
    });

    return;
  } catch (error) {
    handleChatErrors(error, emit);
    return res.end();
  }
};
