import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const env = {
  PORT: process.env.PORT || 8080,
  ENVIRONMENT: process.env.NODE_ENV || "development",
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",

  AI_PROVIDER: process.env.AI_PROVIDER || "gemini",

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "your_gemini_api_key",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",

  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "your_openai_api_key",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-5.4-nano",
  OPENAI_MEMORY_MODEL: process.env.OPENAI_MEMORY_MODEL || "gpt-4.1-mini",
  OPENAI_AGENTS_TRACING_ENABLED:
    process.env.OPENAI_AGENTS_TRACING_ENABLED === "true",

  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || "",
  MASTER_PASSWORD: process.env.MASTER_PASSWORD || "Apple@17",
};
