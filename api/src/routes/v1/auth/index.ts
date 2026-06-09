import { loginUserSchema } from "../../../validators/auth/login";
import { registerUserSchema } from "../../../validators/auth/register";
import { Router } from "express";
import { validate } from "../../../middlewares/zod";
import { login } from "./login";
import { register } from "./register";

export const authRouter = Router();

authRouter.post("/register", validate(registerUserSchema), register);
authRouter.post("/login", validate(loginUserSchema), login);
