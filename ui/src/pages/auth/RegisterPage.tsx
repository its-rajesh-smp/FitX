import { AuthForm } from "@/features/auth/components/forms/AuthForm";
import { AuthPageFrame } from "@/features/auth/components/layouts/AuthPageFrame";

export function RegisterPage() {
  return <AuthPageFrame><AuthForm mode="register" /></AuthPageFrame>;
}
