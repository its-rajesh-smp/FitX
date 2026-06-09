import { User } from "../../../db/models/User";
import { Request, Response } from "express";

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id!);

  if (!user) {
    return res.error("User not found", 404);
  }

  return res.success(user);
};
