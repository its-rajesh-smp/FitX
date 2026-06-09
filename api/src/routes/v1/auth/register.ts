import { User } from "../../../db/models/User";
import { UserPlan } from "../../../db/models/UserPlan";
import { hashPassword } from "../../../utils/bcrypt";
import { createJwtToken } from "../../../utils/jwt";
import { RegisterUserInput } from "../../../validators/auth/register";
import { Request, Response } from "express";

export const register = async (
  req: Request<object, object, RegisterUserInput>,
  res: Response,
) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    return res.error("User already exists", 409);
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ email, password: hashedPassword, name });
  await UserPlan.create({ userId: user.id });
  const token = createJwtToken({ email: user.email, id: user.id });

  return res.success({ token, user }, "User registered successfully");
};
