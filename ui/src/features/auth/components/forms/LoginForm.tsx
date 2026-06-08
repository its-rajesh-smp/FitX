import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/features/auth/services/loginUser";
import { getAuthError } from "@/features/auth/helpers/getAuthError";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { AuthField, AuthFormCard } from "./AuthFormCard";
import { loginSchema, type LoginValues } from "./authSchemas";

export function LoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (auth) => {
      setAuth(auth);
      navigate("/plan", { replace: true });
    },
  });

  return (
    <AuthFormCard
      title="Welcome back"
      description="Sign in to continue your training plan."
      footer={
        <>
          New to FitAI?{" "}
          <Link
            className="text-primary font-bold hover:underline"
            to="/register"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="mt-7 space-y-4"
      >
        <AuthField
          label="Email address"
          error={form.formState.errors.email?.message}
        >
          <Input
            type="email"
            placeholder="alex@example.com"
            {...form.register("email")}
          />
        </AuthField>
        <AuthField
          label="Password"
          error={form.formState.errors.password?.message}
        >
          <Input
            type="password"
            placeholder="At least 8 characters"
            {...form.register("password")}
          />
        </AuthField>
        {mutation.error && (
          <p className="text-destructive text-sm">
            {getAuthError(mutation.error)}
          </p>
        )}
        <Button
          type="submit"
          className="mt-2 h-11 w-full rounded-lg"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthFormCard>
  );
}
