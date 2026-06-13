import { UserPlan } from "../../../db/models/UserPlan";
import { Request, Response } from "express";

export const getCurrentPlan = async (req: Request, res: Response) => {
  const plan = await UserPlan.findByUserIdWithDetails(req.user!.id!, false);

  return res.success(plan ?? null);
};
