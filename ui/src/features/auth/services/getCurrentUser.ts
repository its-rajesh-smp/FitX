import { api, type ApiEnvelope } from "@/libs/api";
import type { User } from "@/features/auth/types/user";

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiEnvelope<User>>("/me");
  return response.data.data;
};
