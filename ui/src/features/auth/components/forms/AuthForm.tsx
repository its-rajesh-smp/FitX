import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from "./authSchemas";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const schema = isRegister ? registerSchema : loginSchema;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues | RegisterValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    navigate("/plan");
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-card sm:p-8">
      <h1 className="text-3xl font-extrabold">{isRegister ? "Start your journey" : "Welcome back"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{isRegister ? "Create your account and build your first plan." : "Sign in to continue your training plan."}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        {isRegister && <Field label="Full name" error={errors && "name" in errors ? errors.name?.message : undefined}><Input placeholder="Alex Johnson" {...register("name" as keyof RegisterValues)} /></Field>}
        <Field label="Email address" error={errors.email?.message}><Input type="email" placeholder="alex@example.com" {...register("email")} /></Field>
        <Field label="Password" error={errors.password?.message}><Input type="password" placeholder="At least 8 characters" {...register("password")} /></Field>
        <Button className="mt-2 h-11 w-full rounded-lg" disabled={isSubmitting}>{isSubmitting ? "One moment..." : isRegister ? "Create account" : "Sign in"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isRegister ? "Already have an account? " : "New to FitAI? "}
        <Link className="font-bold text-primary hover:underline" to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link>
      </p>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold">{label}</span>{children}{error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}</label>;
}
