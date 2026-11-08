import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/features/auth/services/loginUser";
import { getAuthError } from "@/features/auth/helpers/getAuthError";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { AuthField, AuthFormCard } from "./AuthFormCard";
import { AUTH_INPUT_CLASS, AUTH_PRIMARY_BUTTON_CLASS } from "./authStyles";
import { loginSchema, type LoginValues } from "./authSchemas";
import { PasswordInput } from "./PasswordInput";

export function LoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (auth) => {
      setAuth(auth);
      navigate("/chat", { replace: true });
    },
  });

  return (
    <AuthFormCard
      title="Sign in to FitX"
      description="Welcome back. Pick up your week where you left off."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-ink hover:underline" to="/register">
            Sign up
          </Link>
        </>
      }
    >
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-3.5"
      >
        <AuthField
          label="Email address"
          error={form.formState.errors.email?.message}
        >
          <Input
            className={AUTH_INPUT_CLASS}
            type="email"
            placeholder="alex@example.com"
            autoComplete="email"
            {...form.register("email")}
          />
        </AuthField>
        <AuthField
          label="Password"
          error={form.formState.errors.password?.message}
        >
          <PasswordInput
            className={AUTH_INPUT_CLASS}
            placeholder="At least 8 characters"
            autoComplete="current-password"
            {...form.register("password")}
          />
        </AuthField>
        {mutation.error && (
          <p className="text-[12px] text-danger">
            {getAuthError(mutation.error)}
          </p>
        )}
        <Button
          type="submit"
          className={cn(AUTH_PRIMARY_BUTTON_CLASS, "mt-2")}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthFormCard>
  );
}
