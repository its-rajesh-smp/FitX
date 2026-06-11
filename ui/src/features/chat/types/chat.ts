export interface ChatThread {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type ChatWidget =
  | { type: "none"; label?: string }
  | { type: "experience_level"; label?: string }
  | { type: "muscle_multi_select"; label?: string }
  | { type: "equipment_multi_select"; label?: string }
  | { type: "user_plan"; label?: string };

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
