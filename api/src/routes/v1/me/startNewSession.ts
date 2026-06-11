import { Request, Response } from "express";
import { startNewSession as resetUserSession } from "../../../services/sessions/startNewSession";

export const startNewSession = async (req: Request, res: Response) => {
  await resetUserSession(req.user!.id!);

  return res.success(null, "New session started successfully");
};
