export interface ChatThread {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatExercise {
  id: string;
  name: string;
  level: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  recommendation: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  threadId: string;
  role: "Assistant" | "Human";
  content: {
    text: string;
    quickAnswers?: string[];
    widget?: "heightWeight";
    exercises?: ChatExercise[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  thread: ChatThread;
  message: ChatMessage;
}
