import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getCurrentUser } from "@/features/auth/services/getCurrentUser";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

/** Fetches the authenticated user and keeps the auth store synchronized. */
export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["current-user", token],
    queryFn: getCurrentUser,
    enabled: Boolean(token),
    retry: false,
  });

  useEffect(() => {
    if (query.data) updateUser(query.data);
  }, [query.data, updateUser]);

  useEffect(() => {
    if (query.isError) {
      clearAuth();
      navigate("/", { replace: true });
    }
  }, [query.isError]);

  return query;
}
