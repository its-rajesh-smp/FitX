import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useProgram } from "@/features/program/hooks/useProgram";

export function AuthGuard() {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  useCurrentUser();
  useProgram();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
