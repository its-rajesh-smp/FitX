import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/features/auth/services/registerUser";
import { getAuthError } from "@/features/auth/helpers/getAuthError";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { AuthField, AuthFormCard } from "./AuthFormCard";
import { registerSchema, type RegisterValues } from "./authSchemas";

export function RegisterForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (auth) => {
      setAuth(auth);
      navigate("/plan", { replace: true });
    },
  });

  return (
    <AuthFormCard
      title="Start your journey"
      description="Create your account and build your first plan."
      footer={
        <>
          Already have an account?{" "}
          <Link className="text-primary font-bold hover:underline" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="mt-7 space-y-4"
      >
        <AuthField
          label="Full name"
          error={form.formState.errors.name?.message}
        >
          <Input placeholder="Alex Johnson" {...form.register("name")} />
        </AuthField>
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
          {mutation.isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthFormCard>
  );
}
