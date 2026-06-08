import { LoginForm } from "@/features/auth/components/forms/LoginForm";
import { AuthPageFrame } from "@/features/auth/components/layouts/AuthPageFrame";

export function LoginPage() {
  return (
    <AuthPageFrame>
      <LoginForm />
    </AuthPageFrame>
  );
}
