import z from "zod";

export const googleAuthSchema = z.object({
  accessToken: z.string().min(1, "Google access token is required").max(4096),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
