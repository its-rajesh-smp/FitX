import { AuthForm } from "@/features/auth/components/forms/AuthForm";
import { AuthPageFrame } from "@/features/auth/components/layouts/AuthPageFrame";

export function LoginPage() {
  return <AuthPageFrame><AuthForm mode="login" /></AuthPageFrame>;
}
