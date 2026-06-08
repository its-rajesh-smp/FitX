import { env } from "@config/env";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthTokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export const createJwtToken = (payload: Pick<AuthTokenPayload, "id" | "email">) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyJwtToken = (token: string): AuthTokenPayload => {
  const payload = jwt.verify(token, env.JWT_SECRET);

  if (
    typeof payload === "string" ||
    typeof payload.id !== "string" ||
    typeof payload.email !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return payload as AuthTokenPayload;
};
