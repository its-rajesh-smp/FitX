import { api, type ApiEnvelope } from "@/libs/api";
import type { AuthResponse } from "@/features/auth/types/user";

export const googleAuth = async (accessToken: string): Promise<AuthResponse> => {
  const response = await api.post<ApiEnvelope<AuthResponse>>("/auth/google", { accessToken });
  return response.data.data;
};
