import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dumbbell, MessageSquarePlus, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { ChatStatusIndicator } from "@/features/chat/components/ChatStatusIndicator";
import { HeightWeightWidget } from "@/features/chat/components/HeightWeightWidget";
import { MarkdownMessage } from "@/features/chat/components/MarkdownMessage";
import { QuickAnswers } from "@/features/chat/components/QuickAnswers";
import { getChats } from "@/features/chat/services/getChats";
import { streamChatMessage, type ChatStatus } from "@/features/chat/services/streamChatMessage";
import type { ChatMessage, ChatThread } from "@/features/chat/types/chat";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { cn } from "@/lib/utils";

const formatHumanMessage = (text: string) =>
  text.match(/^Question: .+\nAnswer: (.+)$/s)?.[1] ?? text;

export function ChatPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [chatOverride, setChatOverride] = useState<{ thread: ChatThread | null; messages: ChatMessage[] } | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<{ type: ChatStatus; label: string } | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [answeredWidgets, setAnsweredWidgets] = useState<Record<string, string>>({});
  const [customQuestion, setCustomQuestion] = useState<{ key: string; question: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatsQuery = useQuery({ queryKey: ["chats"], queryFn: getChats });
  const chat = chatOverride ?? chatsQuery.data ?? { thread: null, messages: [] };
  const { thread, messages } = chat;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const messageText = customQuestion
      ? `Question: ${customQuestion.question}\nAnswer: ${text}`
      : text;
    const activeCustomQuestion = customQuestion;
    if (activeCustomQuestion) {
      setAnsweredWidgets((current) => ({
        ...current,
        [activeCustomQuestion.key]: text,
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
        { message: messageText, ...(thread?.id && { threadId: thread.id }) },
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

          if (event.type === "completed") {
            setChatOverride((current) => {
              const next = (current?.messages ?? []).map((item) => item.id === "pending-assistant" ? event.message : item);
              queryClient.setQueryData(["chats"], { thread: event.thread, messages: next });
              return { thread: event.thread, messages: next };
            });
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

  const newChat = () => {
    setChatOverride({ thread: null, messages: [] });
    setStreamError(null);
    setCustomQuestion(null);
    setAnsweredWidgets({});
  };

  const selectQuickAnswer = (widgetKey: string, question: string, answer: string) => {
    setAnsweredWidgets((current) => ({ ...current, [widgetKey]: answer }));
    send(`Question: ${question}\nAnswer: ${answer}`);
  };

  const requestCustomAnswer = (widgetKey: string, question: string) => {
    setAnsweredWidgets((current) => ({ ...current, [widgetKey]: "Something else" }));
    setCustomQuestion({ key: widgetKey, question });
  };

  const empty = messages.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur sm:px-8">
        <div><h1 className="font-extrabold">FitX Chat</h1><p className="text-xs text-muted-foreground">Your AI fitness companion</p></div>
        <Button variant="outline" onClick={newChat}><MessageSquarePlus />New chat</Button>
      </header>

      {empty ? (
        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg"><Dumbbell className="size-7" /></span>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight">How can I help, {user?.name?.split(" ")[0] ?? "there"}?</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Ask FitX anything about training, fitness, or building a routine that works for you.</p>
            <div className="mt-8"><ChatComposer onSend={send} isPending={isStreaming} large /></div>
            {streamError && <p className="mt-3 text-sm text-destructive">{streamError}</p>}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["How should I start working out?", "Help me stay consistent", "What should I train today?"].map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="rounded-full border px-4 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary">{prompt}</button>)}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
            <div className="space-y-7">
              {messages.map((message, messageIndex) => (
                <div key={message.id} className={cn("flex gap-3", message.role === "Human" && "justify-end")}>
                  {message.role === "Assistant" && <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white"><Sparkles className="size-4" /></span>}
                  <div className={cn("max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-7", message.role === "Human" ? "bg-primary-soft text-foreground" : "bg-transparent", message.id === "pending-assistant" && "text-muted-foreground")}>
                    {message.id === "pending-assistant" && status && <div className="mb-2"><ChatStatusIndicator status={status.type} label={status.label} /></div>}
                    {message.role === "Assistant" ? <MarkdownMessage>{message.content.text}</MarkdownMessage> : formatHumanMessage(message.content.text)}
                    {message.role === "Assistant" && message.content.widget === "heightWeight" ? (() => {
                      const widgetKey = message.id;
                      const nextHumanMessage = messages
                        .slice(messageIndex + 1)
                        .find((item) => item.role === "Human");
                      const persistedResponse = nextHumanMessage?.content.text
                        .match(/^Question: (.+)\nAnswer: (.+)$/s);
                      const persistedAnswer = persistedResponse?.[1] === message.content.text
                        ? persistedResponse[2]
                        : undefined;
                      const selectedAnswer = answeredWidgets[widgetKey] ?? persistedAnswer;

                      return (
                        <HeightWeightWidget
                          disabled={isStreaming}
                          selectedAnswer={selectedAnswer}
                          onSubmit={(answer) => selectQuickAnswer(widgetKey, message.content.text, answer)}
                        />
                      );
                    })() : null}
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
                      const selectedAnswer = answeredWidgets[widgetKey] ?? persistedAnswer;

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
                  </div>
                </div>
              ))}
              {streamError && <p className="text-center text-sm text-destructive">{streamError}</p>}
              <div ref={bottomRef} />
            </div>
          </div>
          <div className="sticky bottom-0 border-t bg-white/95 p-4 backdrop-blur">
            <div className="mx-auto max-w-3xl">
              {customQuestion && (
                <p className="mb-2 text-xs font-medium text-primary">
                  Type your own answer to: {customQuestion.question}
                </p>
              )}
              <ChatComposer
                key={customQuestion?.key ?? "default"}
                onSend={send}
                isPending={isStreaming}
                autoFocus={Boolean(customQuestion)}
                placeholder={customQuestion ? "Type your answer..." : "Message FitX"}
              />
              <p className="mt-2 text-center text-[10px] text-muted-foreground">FitX can make mistakes. Use your judgment for health and training decisions.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
