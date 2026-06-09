import { verifyJwtToken } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return res.error("Unauthorized", 401);
  }

  try {
    const payload = verifyJwtToken(authorization.slice(7));
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch {
    return res.error("Unauthorized", 401);
  }
};
