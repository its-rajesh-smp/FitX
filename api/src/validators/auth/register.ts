import z from "zod";

export const registerUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.email().transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
