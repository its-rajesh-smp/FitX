import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { setDefaultOpenAIKey, setTracingDisabled } from "@openai/agents";
import { aisdk } from "@openai/agents-extensions/ai-sdk";
import { env } from "./env";

const createGeminiModel = () => {
  const googleProvider = createGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
  });

  // TODO: temporarily hardcoded. Gemini 2.x (e.g. gemini-2.5-flash-lite) rejects
  // function calling combined with a JSON response schema; Gemini 3.x supports it.
  // Switch back to env.GEMINI_MODEL once .env points at a 3.x model.
  return aisdk(googleProvider("gemini-3.5-flash-lite") as never);
};

const createOpenAIModel = () => {
  setDefaultOpenAIKey(env.OPENAI_API_KEY);
  return env.OPENAI_MODEL;
};

setTracingDisabled(!env.OPENAI_AGENTS_TRACING_ENABLED);
setDefaultOpenAIKey(env.OPENAI_API_KEY);

export const llmModel =
  env.AI_PROVIDER === "openai" ? createOpenAIModel() : createGeminiModel();

export const memoryLlmModel = env.OPENAI_MEMORY_MODEL;
export const llmProviderName = env.AI_PROVIDER;
