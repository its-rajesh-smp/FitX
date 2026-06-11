import { Router } from "express";
import { getCurrentUser } from "./getCurrentUser";
import { startNewSession } from "./startNewSession";

export const meRouter = Router();

meRouter.get("/", getCurrentUser);
meRouter.post("/new-session", startNewSession);
