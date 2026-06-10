import { run } from "@openai/agents";
import { Request, Response } from "express";
import { fitXChatAgent } from "../../../agents";
import { db } from "../../../db";
import { ChatThread } from "../../../db/models/ChatThread";
import { Message, MessageRole } from "../../../db/models/Message";
import { User } from "../../../db/models/User";
import {
  generatePrompt,
  getLocalDateContext,
  handleChatErrors,
  useLLMStreaming,
} from "../../../helpers/chat";
import { generateThreadSummary, updateUserDetails } from "../../../services/ai";
import { SendChatMessageInput } from "../../../validators/chat/sendChatMessage";

/**
 * Normalize the widget based on the response text
 * Sometime AI can return a widget that doesn't match the question. So in that case we need to normalize the widget
 * This is just to safeguard the ui from showing a widget that doesn't match the question
 */
const normalizeWidget = (
  response: Awaited<
    ReturnType<ReturnType<typeof useLLMStreaming>["streamAIResponse"]>
  >,
) => {
  const widgetMatchesQuestion =
    response.widget.type === "none" ||
    (response.widget.type === "experience_level" &&
      /\b(experience|worked out|work out|workout|training|exercise regularly|fitness level)\b/i.test(
        response.text,
      )) ||
    (response.widget.type === "muscle_multi_select" &&
      /\b(muscle|muscles|body part|body parts|target area|target areas|want to train|want to target|focus on)\b/i.test(
        response.text,
      )) ||
    (response.widget.type === "equipment_multi_select" &&
      /\b(equipment|body only|dumbbell|barbell|machine|bands|gym|home|have available|access to)\b/i.test(
        response.text,
      )) ||
    (response.widget.type === "user_plan" &&
      /\b(plan|workout|schedule|created|updated|ready|exercises)\b/i.test(
        response.text,
      ));

  const widget = widgetMatchesQuestion
    ? response.widget
    : { type: "none" as const, label: "" };

  return {
    ...response,
    widget,
    quickAnswers: widget.type === "none" ? response.quickAnswers : [],
  };
};

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

    const llmResponse = normalizeWidget(await streamAIResponse(result));

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
            widget:
              llmResponse.widget.type === "none" && didPlanMutate()
                ? { type: "user_plan", label: "Your workout plan is ready" }
                : llmResponse.widget,
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
