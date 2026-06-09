import { UserPlan } from "@models/UserPlan";
import { Request, Response } from "express";

export const getCurrentPlan = async (req: Request, res: Response) => {
  const plan = await UserPlan.findByUserIdWithDetails(req.user!.id!);

  return res.success(plan ?? null);
};
