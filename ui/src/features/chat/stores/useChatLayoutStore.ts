import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserLayoutState {
  hasChat: boolean;
  hasPlan: boolean;
  panelLayout?: {
    chat: number;
    planner: number;
  };
}

interface ChatLayoutState {
  users: Record<string, UserLayoutState>;
  updateUserLayout: (userId: string, layout: Partial<UserLayoutState>) => void;
}

export const useChatLayoutStore = create<ChatLayoutState>()(
  persist(
    (set) => ({
      users: {},
      updateUserLayout: (userId, layout) =>
        set((state) => {
          const current = state.users[userId];

          return {
            users: {
              ...state.users,
              [userId]: {
                hasChat: layout.hasChat ?? current?.hasChat ?? false,
                hasPlan: layout.hasPlan ?? current?.hasPlan ?? false,
                panelLayout: layout.panelLayout ?? current?.panelLayout,
              },
            },
          };
        }),
    }),
    { name: "fitx-chat-layout" },
  ),
);
