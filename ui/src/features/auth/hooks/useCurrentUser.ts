import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

/** Fetches the authenticated user and keeps the auth store synchronized. */
export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);
  const updateUser = useAuthStore((state) => state.updateUser);

  const query = useQuery({
    queryKey: ["current-user", token],
    queryFn: getCurrentUser,
    enabled: Boolean(token),
    retry: false,
  });

  useEffect(() => {
    if (query.data) updateUser(query.data);
  }, [query.data, updateUser]);

  return query;
}
