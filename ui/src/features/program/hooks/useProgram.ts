import { useQuery } from "@tanstack/react-query";
import { getProgram } from "@/features/program/services/getProgram";

export const useProgram = () =>
  useQuery({
    queryKey: ["program"],
    queryFn: getProgram,
  });
