import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dumbbell,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightOpen,
  Sparkles,
} from "lucide-react";
import type { Layout, PanelImperativeHandle, PanelSize } from "react-resizable-panels";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { ChatLayoutSkeleton } from "@/features/chat/components/ChatLayoutSkeleton";
import { ChatStatusIndicator } from "@/features/chat/components/ChatStatusIndicator";
import { ChatWidgetRenderer } from "@/features/chat/components/widgets/ChatWidgetRenderer";
import { MarkdownMessage } from "@/features/chat/components/MarkdownMessage";
import { QuickAnswers } from "@/features/chat/components/QuickAnswers";
import { getChats } from "@/features/chat/services/getChats";
import { streamChatMessage, type ChatStatus } from "@/features/chat/services/streamChatMessage";
import { useChatLayoutStore } from "@/features/chat/stores/useChatLayoutStore";
import type { ChatMessage, ChatThread } from "@/features/chat/types/chat";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { WorkoutPlannerPanel } from "@/features/program/components/WorkoutPlannerPanel";
import { useProgram } from "@/features/program/hooks/useProgram";
import { cn } from "@/lib/utils";

const formatHumanMessage = (text: string) =>
  text.match(/^Question: .+\nAnswer: (.+)$/s)?.[1] ?? text;

export function ChatPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const cachedLayout = useChatLayoutStore((state) =>
    userId ? state.users[userId] : undefined,
  );
  const updateUserLayout = useChatLayoutStore((state) => state.updateUserLayout);
  const [chatOverride, setChatOverride] = useState<{ thread: ChatThread | null; messages: ChatMessage[] } | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<{ type: ChatStatus; label: string } | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [answeredWidgets, setAnsweredWidgets] = useState<Record<string, string>>({});
  const [customQuestion, setCustomQuestion] = useState<{ key: string; question: string } | null>(null);
  const [composerFocusSignal, setComposerFocusSignal] = useState(0);
  const [mobilePlannerOpen, setMobilePlannerOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
  const [isCompactChat, setIsCompactChat] = useState(() => window.innerWidth < 640);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [plannerCollapsed, setPlannerCollapsed] = useState(false);
  const chatPanelRef = useRef<PanelImperativeHandle>(null);
  const plannerPanelRef = useRef<PanelImperativeHandle>(null);
  const chatContentRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasPositionedInitialMessages = useRef(false);
  const chatsQuery = useQuery({ queryKey: ["chats"], queryFn: getChats });
  const programQuery = useProgram();
  const chat = chatOverride ?? chatsQuery.data ?? { thread: null, messages: [] };
  const { thread, messages } = chat;
  const planDays = programQuery.data?.days ?? [];
  const hasPlan = Boolean(
    planDays.length === 7 &&
    new Set(planDays.map((day) => day.dayNumber)).size === 7 &&
    planDays.some((day) => day.exercises.length > 0),
  );
  const isInitialLayoutLoading =
    (!chatOverride && chatsQuery.isPending) || programQuery.isPending;

  useLayoutEffect(() => {
    if (!messages.length) return;

    bottomRef.current?.scrollIntoView({
      behavior: hasPositionedInitialMessages.current ? "smooth" : "instant",
    });
    hasPositionedInitialMessages.current = true;
  }, [messages]);

  useEffect(() => {
    if (!user?.id || !chatsQuery.data || programQuery.data === undefined) return;

    updateUserLayout(user.id, {
      hasChat: chatsQuery.data.messages.length > 0,
      hasPlan,
    });
  }, [chatsQuery.data, hasPlan, programQuery.data, updateUserLayout, user?.id]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateDesktop = () => setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateDesktop);
    return () => mediaQuery.removeEventListener("change", updateDesktop);
  }, []);

  useEffect(() => {
    const chatContent = chatContentRef.current;
    if (!chatContent) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsCompactChat(entry.contentRect.width < 480);
    });
    observer.observe(chatContent);
    return () => observer.disconnect();
  }, [isInitialLayoutLoading]);

  useEffect(() => {
    if (!isDesktop) {
      chatPanelRef.current?.resize("100%");
      return;
    }

    if (!hasPlan) chatPanelRef.current?.resize("100%");
  }, [hasPlan, isDesktop]);

  const handleChatResize = useCallback((size: PanelSize) => {
    setChatCollapsed(size.inPixels < 1);
  }, []);

  const handlePlannerResize = useCallback((size: PanelSize) => {
    setPlannerCollapsed(size.inPixels < 1);
  }, []);

  const handleLayoutChanged = useCallback((layout: Layout) => {
    if (!userId || !isDesktop || !hasPlan) return;
    if (layout.chat === undefined || layout.planner === undefined) return;

    updateUserLayout(userId, {
      panelLayout: {
        chat: layout.chat,
        planner: layout.planner,
      },
    });
  }, [hasPlan, isDesktop, updateUserLayout, userId]);

  const send = async (
    text: string,
    answerContext = customQuestion,
  ) => {
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

    const optimistic: ChatMessage = { id: "pending-human", userId: user?.id ?? "", threadId: thread?.id ?? "", role: "Human", content: { text: messageText }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const pending: ChatMessage = { ...optimistic, id: "pending-assistant", role: "Assistant", content: { text: "" } };
    setChatOverride((current) => ({ thread: current?.thread ?? thread, messages: [...(current?.messages ?? messages), optimistic, pending] }));
    setIsStreaming(true);
    setStreamError(null);

    try {
      await streamChatMessage(
        {
          message: messageText,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...(thread?.id && { threadId: thread.id }),
        },
        (event) => {
          if (event.type === "status") {
            setStatus({ type: event.status, label: event.label });
          }

          if (event.type === "delta") {
            setChatOverride((current) => ({
              thread: current?.thread ?? thread,
              messages: (current?.messages ?? []).map((item) => item.id === "pending-assistant" ? { ...item, content: { ...item.content, text: item.content.text + event.text } } : item),
            }));
          }

          if (event.type === "text_snapshot") {
            setChatOverride((current) => ({
              thread: current?.thread ?? thread,
              messages: (current?.messages ?? []).map((item) => item.id === "pending-assistant" ? { ...item, content: { ...item.content, text: event.text } } : item),
            }));
          }

          if (event.type === "completed") {
            setChatOverride((current) => {
              const next = (current?.messages ?? []).map((item) => item.id === "pending-assistant" ? event.message : item);
              queryClient.setQueryData(["chats"], { thread: event.thread, messages: next });
              return { thread: event.thread, messages: next };
            });
          }

          if (event.type === "plan_updated") {
            void queryClient.invalidateQueries({ queryKey: ["program"] });
          }

          if (event.type === "error") throw new Error(event.message);
        },
      );
    } catch (error) {
      setStreamError(error instanceof Error ? error.message : "FitX could not respond. Please try again.");
      setChatOverride((current) => ({ thread: current?.thread ?? thread, messages: (current?.messages ?? []).filter((item) => item.id !== "pending-assistant") }));
    } finally {
      setIsStreaming(false);
      setStatus(null);
    }
  };

  const selectQuickAnswer = (widgetKey: string, question: string, answer: string) => {
    send(answer, { key: widgetKey, question });
  };

  const requestCustomAnswer = (widgetKey: string, question: string) => {
    setCustomQuestion({ key: widgetKey, question });
    setComposerFocusSignal((current) => current + 1);
  };

  const empty = messages.length === 0;
  const logout = () => {
    clearAuth();
    navigate("/", { replace: true });
  };
  const toggleChat = () => {
    const panel = chatPanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  };
  const toggleMobilePlanner = () => setMobilePlannerOpen((current) => !current);
  const panelControlLabel = isDesktop
    ? chatCollapsed
      ? "Show chat"
      : "Hide chat"
    : mobilePlannerOpen
      ? "Close workout planner"
      : "Open workout planner";

  if (isInitialLayoutLoading) {
    return (
      <ChatLayoutSkeleton
        hasChat={cachedLayout?.hasChat ?? false}
        hasPlan={cachedLayout?.hasPlan ?? false}
        isDesktop={isDesktop}
        panelLayout={cachedLayout?.panelLayout}
      />
    );
  }

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-white">
      <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b bg-white/95 px-3 backdrop-blur sm:px-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
            <Dumbbell className="size-4" />
          </span>
          <div><h1 className="text-sm font-bold">FitX</h1><p className="text-[10px] text-muted-foreground">AI fitness coach</p></div>
        </div>
        <div className="flex items-center gap-1.5">
          {hasPlan && (
            <Button
              variant="outline"
              onClick={isDesktop ? toggleChat : toggleMobilePlanner}
              aria-label={panelControlLabel}
            >
              {isDesktop ? (
                chatCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />
              ) : (
                <PanelRightOpen />
              )}
              <span className="hidden sm:inline">
                {isDesktop
                  ? chatCollapsed
                    ? "Show chat"
                    : "Hide chat"
                  : mobilePlannerOpen
                    ? "Close Planner"
                    : "Workout Planner"}
              </span>
            </Button>
          )}
          <Button variant="ghost" size="icon" aria-label="Log out" onClick={logout}><LogOut /></Button>
        </div>
      </header>

      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 flex-1"
        defaultLayout={
          hasPlan && isDesktop
            ? cachedLayout?.panelLayout ?? { chat: 44, planner: 56 }
            : { chat: 100 }
        }
        onLayoutChanged={handleLayoutChanged}
      >
        <ResizablePanel
          panelRef={chatPanelRef}
          id="chat"
          defaultSize={hasPlan && isDesktop ? "44%" : "100%"}
          minSize={isDesktop ? "360px" : "100%"}
          collapsible={isDesktop}
          collapsedSize={0}
          onResize={handleChatResize}
          className="flex min-w-0 flex-col bg-white"
        >
        <main ref={chatContentRef} className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        {empty ? (
        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20"><Dumbbell className="size-6" /></span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">How can I help, {user?.name?.split(" ")[0] ?? "there"}?</h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-6 text-muted-foreground">Ask FitX anything about training, nutrition, or building a routine that works for you.</p>
            <div className="mt-8"><ChatComposer onSend={send} isPending={isStreaming} large /></div>
            {streamError && <p className="mt-3 text-sm text-destructive">{streamError}</p>}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Build me a weekly strength plan", "How should I start working out?", "What should I train today?", "Help me stay consistent"].map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="rounded-full border px-4 py-2 text-xs text-muted-foreground transition hover:border-primary/50 hover:bg-primary-soft/40 hover:text-primary">{prompt}</button>)}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6">
            <div className="mx-auto w-full max-w-2xl">
            <div className="space-y-7">
              {messages.map((message, messageIndex) => (
                <div key={message.id} className={cn("flex gap-3", message.role === "Human" && "justify-end")}>
                  {message.role === "Assistant" && !isCompactChat && <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white"><Sparkles className="size-4" /></span>}
                  <div className={cn("rounded-2xl py-3 text-sm leading-7", isCompactChat ? "max-w-full px-1" : "max-w-[88%] px-4", message.role === "Human" ? "rounded-tr-md bg-primary px-4 text-white" : "bg-transparent", message.id === "pending-assistant" && "text-muted-foreground")}>
                    {message.id === "pending-assistant" && status && <div className="mb-2"><ChatStatusIndicator status={status.type} label={status.label} /></div>}
                    {message.role === "Assistant" ? <MarkdownMessage>{message.content.text}</MarkdownMessage> : formatHumanMessage(message.content.text)}
                    {message.role === "Assistant" && message.content.quickAnswers?.length ? (() => {
                      const widgetKey = message.id;
                      const nextHumanMessage = messages
                        .slice(messageIndex + 1)
                        .find((item) => item.role === "Human");
                      const persistedResponse = nextHumanMessage?.content.text
                        .match(/^Question: (.+)\nAnswer: (.+)$/s);
                      const persistedAnswer = persistedResponse?.[1] === message.content.text
                        ? persistedResponse[2]
                        : undefined;
                      const selectedAnswer =
                        answeredWidgets[widgetKey] ??
                        persistedAnswer ??
                        (nextHumanMessage ? "Answered" : undefined);

                      return (
                        <QuickAnswers
                          answers={message.content.quickAnswers}
                          disabled={isStreaming}
                          selectedAnswer={selectedAnswer}
                          onSelect={(answer) => selectQuickAnswer(widgetKey, message.content.text, answer)}
                          onCustomAnswer={() => requestCustomAnswer(widgetKey, message.content.text)}
                        />
                      );
                    })() : null}
                    {message.role === "Assistant" ? (() => {
                      const widget = message.content.widget;
                      if (!widget || widget.type === "none") return null;

                      const widgetKey = message.id;
                      const nextHumanMessage = messages
                        .slice(messageIndex + 1)
                        .find((item) => item.role === "Human");
                      const persistedResponse = nextHumanMessage?.content.text
                        .match(/^Question: (.+)\nAnswer: (.+)$/s);
                      const answered =
                        Boolean(answeredWidgets[widgetKey]) ||
                        persistedResponse?.[1] === message.content.text ||
                        Boolean(nextHumanMessage);

                      return (
                        <ChatWidgetRenderer
                          widget={widget}
                          disabled={isStreaming}
                          answered={answered}
                          onSubmit={(values) =>
                            send(values.join(", "), {
                              key: widgetKey,
                              question: message.content.text,
                            })
                          }
                        />
                      );
                    })() : null}
                  </div>
                </div>
              ))}
              {streamError && <p className="text-center text-sm text-destructive">{streamError}</p>}
              <div ref={bottomRef} />
            </div>
            </div>
          </div>
          <div className="sticky bottom-0 border-t bg-white/95 p-4 backdrop-blur">
            <div className="mx-auto max-w-3xl">
              <ChatComposer
                onSend={send}
                isPending={isStreaming}
                focusSignal={composerFocusSignal}
                highlighted={Boolean(customQuestion)}
                placeholder={customQuestion ? "Type your answer..." : "Message FitX"}
              />
              <p className="mt-2 text-center text-[10px] text-muted-foreground">FitX can make mistakes. Use your judgment for health and training decisions.</p>
            </div>
          </div>
        </>
      )}
        </main>
        </ResizablePanel>

        {hasPlan && isDesktop && programQuery.data && (
          <>
            <ResizableHandle
              withHandle
              className="hidden lg:flex"
              disabled={false}
            />
            <ResizablePanel
              panelRef={plannerPanelRef}
              id="planner"
              defaultSize="56%"
              minSize="430px"
              collapsible
              collapsedSize={0}
              onResize={handlePlannerResize}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "h-full",
                  plannerCollapsed && "hidden",
                )}
              >
                <WorkoutPlannerPanel
                  plan={programQuery.data}
                  onClose={toggleMobilePlanner}
                  showCloseButton={false}
                />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {hasPlan && !isDesktop && mobilePlannerOpen && programQuery.data && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-30">
          <WorkoutPlannerPanel
            plan={programQuery.data}
            onClose={toggleMobilePlanner}
          />
        </div>
      )}
    </div>
  );
}
