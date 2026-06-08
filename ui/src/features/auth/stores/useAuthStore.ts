import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse, User } from "@/features/auth/types/user";

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (auth: AuthResponse) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      updateUser: (user) => set({ user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    { name: "fitx-auth" },
  ),
);
