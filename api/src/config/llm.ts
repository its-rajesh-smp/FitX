import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { setDefaultOpenAIKey, setTracingDisabled } from "@openai/agents";
import { aisdk } from "@openai/agents-extensions/ai-sdk";
import { env } from "@config/env";

const createGeminiModel = () => {
  const googleProvider = createGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY,
  });

  return aisdk(googleProvider(env.GEMINI_MODEL) as never);
};

const createOpenAIModel = () => {
  setDefaultOpenAIKey(env.OPENAI_API_KEY);
  return env.OPENAI_MODEL;
};

setTracingDisabled(!env.OPENAI_AGENTS_TRACING_ENABLED);
setDefaultOpenAIKey(env.OPENAI_API_KEY);

export const llmModel = env.AI_PROVIDER === "openai"
  ? createOpenAIModel()
  : createGeminiModel();

export const memoryLlmModel = env.OPENAI_MEMORY_MODEL;
export const llmProviderName = env.AI_PROVIDER;
