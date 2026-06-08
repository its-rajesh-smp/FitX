import { api, type ApiEnvelope } from "@/libs/api";
import type { RegisterValues } from "@/features/auth/components/forms/authSchemas";
import type { AuthResponse } from "@/features/auth/types/user";

export const registerUser = async (payload: RegisterValues): Promise<AuthResponse> => {
  const response = await api.post<ApiEnvelope<AuthResponse>>("/auth/register", payload);
  return response.data.data;
};
