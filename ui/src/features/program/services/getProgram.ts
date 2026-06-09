import { api, type ApiEnvelope } from "@/libs/api";
import type { ProgramPlan } from "@/features/program/types/program";

export const getProgram = async (): Promise<ProgramPlan | null> => {
  const response = await api.get<ApiEnvelope<ProgramPlan | null>>("/plans/me");
  return response.data.data;
};
