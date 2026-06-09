import { Router } from "express";
import { getCurrentPlan } from "./getCurrentPlan";

export const plansRouter = Router();

plansRouter.get("/me", getCurrentPlan);
