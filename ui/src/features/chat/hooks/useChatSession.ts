import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { getChats } from "@/features/chat/services/getChats";
import {
  streamChatMessage,
  type ChatStreamEvent,
} from "@/features/chat/services/streamChatMessage";
import type { ChatMessage, ChatThread } from "@/features/chat/types/chat";
import type {
  ActiveChatStatus,
  AnswerContext,
  SendChatMessage,
} from "@/features/chat/types/chatUi";
import { useProgram } from "@/features/program/hooks/useProgram";

const EMPTY_CHAT = { thread: null, messages: [] };

export function useChatSession() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const chatsQuery = useQuery({ queryKey: ["chats"], queryFn: getChats });
  const programQuery = useProgram();
  const [chatOverride, setChatOverride] = useState<{
    thread: ChatThread | null;
    messages: ChatMessage[];
  } | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<ActiveChatStatus | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [answeredWidgets, setAnsweredWidgets] = useState<Record<string, string>>(
    {},
  );
  const [customQuestion, setCustomQuestion] = useState<AnswerContext | null>(
    null,
  );
  const [composerFocusSignal, setComposerFocusSignal] = useState(0);
  const [isPlannerUpdating, setIsPlannerUpdating] = useState(false);
  const [plannerRefreshSignal, setPlannerRefreshSignal] = useState(0);
  const [showPlanUpdatedToast, setShowPlanUpdatedToast] = useState(false);

  const { thread, messages } = chatOverride ?? chatsQuery.data ?? EMPTY_CHAT;

  useEffect(() => {
    if (!showPlanUpdatedToast) return;
    const timeout = window.setTimeout(
      () => setShowPlanUpdatedToast(false),
      3000,
    );
    return () => window.clearTimeout(timeout);
  }, [showPlanUpdatedToast]);

  const handlePlanUpdated = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["program"] });
      setPlannerRefreshSignal((current) => current + 1);
      setShowPlanUpdatedToast(true);
    } finally {
      setIsPlannerUpdating(false);
    }
  }, [queryClient]);

  const updatePendingAssistant = useCallback(
    (
      pendingAssistantId: string,
      update: (message: ChatMessage) => ChatMessage,
    ) => {
      setChatOverride((current) => ({
        thread: current?.thread ?? thread,
        messages: (current?.messages ?? []).map((message) =>
          message.id === pendingAssistantId ? update(message) : message,
        ),
      }));
    },
    [thread],
  );

  const handleStreamEvent = useCallback(
    (event: ChatStreamEvent, pendingAssistantId: string) => {
      switch (event.type) {
        case "status":
          setStatus({ type: event.status, label: event.label });
          if (["generating_plan", "updating_plan"].includes(event.status)) {
            setIsPlannerUpdating(true);
          }
          break;
        case "delta":
          updatePendingAssistant(pendingAssistantId, (message) => ({
            ...message,
            content: {
              ...message.content,
              text: message.content.text + event.text,
            },
          }));
          break;
        case "text_snapshot":
          updatePendingAssistant(pendingAssistantId, (message) => ({
            ...message,
            content: { ...message.content, text: event.text },
          }));
          break;
        case "completed":
          setChatOverride((current) => {
            const nextMessages = (current?.messages ?? []).map((message) =>
              message.id === pendingAssistantId ? event.message : message,
            );
            const nextChat = { thread: event.thread, messages: nextMessages };
            queryClient.setQueryData(["chats"], nextChat);
            return nextChat;
          });
          break;
        case "plan_updated":
          void handlePlanUpdated();
          break;
        case "error":
          throw new Error(event.message);
      }
    },
    [handlePlanUpdated, queryClient, updatePendingAssistant],
  );

  const send: SendChatMessage = async (text, answerContext = customQuestion) => {
    const messageText = answerContext
      ? `Question: ${answerContext.question}\nAnswer: ${text}`
      : text;

    if (answerContext) {
      setAnsweredWidgets((current) => ({
        ...current,
        [answerContext.key]: text,
      }));
      setCustomQuestion(null);
    }

    const now = new Date().toISOString();
    const optimisticId = `pending-human-${crypto.randomUUID()}`;
    const pendingAssistantId = `pending-assistant-${crypto.randomUUID()}`;
    const optimisticMessage: ChatMessage = {
      id: optimisticId,
      userId: user?.id ?? "",
      threadId: thread?.id ?? "",
      role: "Human",
      content: { text: messageText },
      createdAt: now,
      updatedAt: now,
    };
    const pendingAssistant: ChatMessage = {
      ...optimisticMessage,
      id: pendingAssistantId,
      role: "Assistant",
      content: { text: "" },
    };

    setChatOverride((current) => ({
      thread: current?.thread ?? thread,
      messages: [
        ...(current?.messages ?? messages),
        optimisticMessage,
        pendingAssistant,
      ],
    }));
    setIsStreaming(true);
    setStreamError(null);

    try {
      await streamChatMessage(
        {
          message: messageText,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...(thread?.id && { threadId: thread.id }),
        },
        (event) => handleStreamEvent(event, pendingAssistantId),
      );
    } catch (error) {
      setStreamError(
        error instanceof Error
          ? error.message
          : "FitX could not respond. Please try again.",
      );
      setIsPlannerUpdating(false);
      setChatOverride((current) => ({
        thread: current?.thread ?? thread,
        messages: (current?.messages ?? []).filter(
          (message) => message.id !== pendingAssistantId,
        ),
      }));
    } finally {
      setIsStreaming(false);
      setStatus(null);
    }
  };

  const selectQuickAnswer = (
    widgetKey: string,
    question: string,
    answer: string,
  ) => void send(answer, { key: widgetKey, question });

  const requestCustomAnswer = (widgetKey: string, question: string) => {
    setCustomQuestion({ key: widgetKey, question });
    setComposerFocusSignal((current) => current + 1);
  };

  return {
    user,
    chatsQuery,
    programQuery,
    messages,
    status,
    streamError,
    answeredWidgets,
    customQuestion,
    composerFocusSignal,
    isStreaming,
    isPlannerUpdating,
    plannerRefreshSignal,
    showPlanUpdatedToast,
    send,
    selectQuickAnswer,
    requestCustomAnswer,
  };
}
