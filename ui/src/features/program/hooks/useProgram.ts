import { useQuery } from "@tanstack/react-query";
import { getProgram } from "@/features/program/services/getProgram";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

/** Fetches the current workout program when the user is authenticated. */
export const useProgram = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["program", token],
    queryFn: getProgram,
    enabled: Boolean(token),
  });
};
