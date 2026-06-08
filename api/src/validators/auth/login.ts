import z from "zod";

export const loginUserSchema = z.object({
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
