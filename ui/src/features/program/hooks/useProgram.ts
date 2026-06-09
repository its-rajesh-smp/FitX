import { useQuery } from "@tanstack/react-query";
import { getProgram } from "@/features/program/services/getProgram";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export const useProgram = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["program", token],
    queryFn: getProgram,
    enabled: Boolean(token),
  });
};
