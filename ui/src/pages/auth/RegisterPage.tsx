import { RegisterForm } from "@/features/auth/components/forms/RegisterForm";
import { AuthPageFrame } from "@/features/auth/components/layouts/AuthPageFrame";

export function RegisterPage() {
  return (
    <AuthPageFrame>
      <RegisterForm />
    </AuthPageFrame>
  );
}
