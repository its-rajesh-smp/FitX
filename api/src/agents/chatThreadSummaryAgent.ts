import { Agent } from "@openai/agents";
import { z } from "zod";
import { memoryLlmModel } from "../config/llm";

const threadSummarySchema = z.object({
  summary: z.string().min(1).max(4000),
});

export const chatThreadSummaryAgent = new Agent({
  name: "FitX Thread Summarizer",
  model: memoryLlmModel,
  outputType: threadSummarySchema,
  instructions: `Maintain a compact short-term summary of a FitX chat thread.

Preserve:
- The user's current intent and open questions.
- Important decisions, advice already given, and unresolved next steps.
- Context needed to continue the conversation naturally.

Do not copy the conversation verbatim. Remove greetings, repetition, and obsolete details.
Return one concise summary under 1200 words.`,
});
