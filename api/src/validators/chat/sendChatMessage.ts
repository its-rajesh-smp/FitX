import z from "zod";

const timeZoneSchema = z.string().max(100).refine((timeZone) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}, "Invalid time zone");

export const sendChatMessageSchema = z.object({
  message: z.string().trim().min(1, "Message is required").max(4000),
  threadId: z.uuid("Invalid thread ID").optional(),
  timeZone: timeZoneSchema,
});

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
