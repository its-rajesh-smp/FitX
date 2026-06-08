import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const env = {
  PORT: process.env.PORT || 8080,
  ENVIRONMENT: process.env.NODE_ENV || "development",
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
};
