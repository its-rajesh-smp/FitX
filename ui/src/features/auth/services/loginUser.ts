import { api, type ApiEnvelope } from "@/libs/api";
import type { LoginValues } from "@/features/auth/components/forms/authSchemas";
import type { AuthResponse } from "@/features/auth/types/user";

export const loginUser = async (payload: LoginValues): Promise<AuthResponse> => {
  const response = await api.post<ApiEnvelope<AuthResponse>>("/auth/login", payload);
  return response.data.data;
};
