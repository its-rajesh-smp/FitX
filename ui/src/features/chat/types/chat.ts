export interface ChatThread {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  threadId: string;
  role: "Assistant" | "Human";
  content: {
    text: string;
    quickAnswers?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  thread: ChatThread;
  message: ChatMessage;
}
