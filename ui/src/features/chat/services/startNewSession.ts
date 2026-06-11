import { api } from "@/libs/api";

export const startNewSession = async (): Promise<void> => {
  await api.post("/me/new-session");
};
