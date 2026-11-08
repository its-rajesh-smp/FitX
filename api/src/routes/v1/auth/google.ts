import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { User } from "../../../db/models/User";
import {
  GoogleAuthError,
  verifyGoogleAccessToken,
} from "../../../services/auth/verifyGoogleAccessToken";
import { hashPassword } from "../../../utils/bcrypt";
import { createJwtToken } from "../../../utils/jwt";
import { GoogleAuthInput } from "../../../validators/auth/google";

export const googleAuth = async (
  req: Request<object, object, GoogleAuthInput>,
  res: Response,
) => {
  let profile;
  try {
    profile = await verifyGoogleAccessToken(req.body.accessToken);
  } catch (error) {
    if (error instanceof GoogleAuthError) {
      return res.error(error.message, 401);
    }
    throw error;
  }

  // Google has verified the email, so an existing account with it is the same person.
  let user = await User.findByEmail(profile.email);
  if (!user) {
    // Google users have no password; store an unguessable hash to satisfy the column.
    const unusablePassword = await hashPassword(randomBytes(32).toString("hex"));
    user = await User.create({
      email: profile.email,
      name: profile.name,
      password: unusablePassword,
    });
  }

  const token = createJwtToken({ id: user.id, email: user.email });

  return res.success({ token, user }, "Logged in with Google");
};
