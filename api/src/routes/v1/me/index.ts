import { Router } from "express";
import { getCurrentUser } from "./getCurrentUser";

export const meRouter = Router();

meRouter.get("/", getCurrentUser);
