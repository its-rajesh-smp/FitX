import { Request, Response } from "express";
import { db } from "../../db";

export const healthCheck = async (_req: Request, res: Response) => {
  await db.raw("SELECT 1");

  return res.success("OK");
};
