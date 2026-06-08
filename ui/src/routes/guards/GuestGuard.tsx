import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export function GuestGuard() {
  const token = useAuthStore((state) => state.token);
  return token ? <Navigate to="/plan" replace /> : <Outlet />;
}
