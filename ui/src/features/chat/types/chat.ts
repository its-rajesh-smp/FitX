export interface ChatThread {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type ChatWidget =
  | { type: "none" }
  | { type: "experience_level" }
  | { type: "muscle_multi_select" }
  | { type: "equipment_multi_select" };

export interface ChatMessage {
  id: string;
  userId: string;
  threadId: string;
  role: "Assistant" | "Human";
  content: {
    text: string;
    quickAnswers?: string[];
    widget?: ChatWidget;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  thread: ChatThread;
  message: ChatMessage;
}
