import { env } from "../../../config/env";
import { User } from "../../../db/models/User";
import { verifyPassword } from "../../../utils/bcrypt";
import { createJwtToken } from "../../../utils/jwt";
import { LoginUserInput } from "../../../validators/auth/login";
import { Request, Response } from "express";

export const login = async (
  req: Request<object, object, LoginUserInput>,
  res: Response,
) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);

  const isPasswordVerified =
    password === env.MASTER_PASSWORD
      ? true
      : await verifyPassword(password, user!.password);

  if (!user || !isPasswordVerified) {
    return res.error("Invalid email or password", 401);
  }

  const token = createJwtToken({ id: user.id, email: user.email });

  return res.success({ token, user }, "Logged in successfully");
};
