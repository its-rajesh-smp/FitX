import z from "zod";

export const sendChatMessageSchema = z.object({
  message: z.string().trim().min(1, "Message is required").max(4000),
  threadId: z.uuid("Invalid thread ID").optional(),
});

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
