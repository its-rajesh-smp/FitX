import { loginUserSchema } from "../../../validators/auth/login";
import { registerUserSchema } from "../../../validators/auth/register";
import { googleAuthSchema } from "../../../validators/auth/google";
import { Router } from "express";
import { validate } from "../../../middlewares/zod";
import { login } from "./login";
import { register } from "./register";
import { googleAuth } from "./google";

export const authRouter = Router();

authRouter.post("/register", validate(registerUserSchema), register);
authRouter.post("/login", validate(loginUserSchema), login);
authRouter.post("/google", validate(googleAuthSchema), googleAuth);
