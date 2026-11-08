import { env } from "../../config/env";

export interface GoogleProfile {
  email: string;
  name: string;
}

interface GoogleTokenInfo {
  aud?: string;
  email?: string;
  email_verified?: string | boolean;
  expires_in?: string;
}

interface GoogleUserInfo {
  name?: string;
  given_name?: string;
}

export class GoogleAuthError extends Error {}

/**
 * Verifies a Google OAuth access token and returns the user's verified profile.
 *
 * The audience check matters: without it, an access token issued to any other
 * Google app could be replayed here to sign in as that user.
 */
export const verifyGoogleAccessToken = async (
  accessToken: string,
): Promise<GoogleProfile> => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new GoogleAuthError("Google sign-in is not configured");
  }

  const tokenInfoResponse = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`,
  );
  if (!tokenInfoResponse.ok) {
    throw new GoogleAuthError("Invalid Google token");
  }

  const tokenInfo = (await tokenInfoResponse.json()) as GoogleTokenInfo;
  const emailVerified =
    tokenInfo.email_verified === true || tokenInfo.email_verified === "true";

  if (tokenInfo.aud !== env.GOOGLE_CLIENT_ID) {
    throw new GoogleAuthError("Google token was not issued for FitX");
  }
  if (!tokenInfo.email || !emailVerified) {
    throw new GoogleAuthError("Your Google email address is not verified");
  }

  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const userInfo = userInfoResponse.ok
    ? ((await userInfoResponse.json()) as GoogleUserInfo)
    : {};

  const email = tokenInfo.email.toLowerCase();
  const name = (userInfo.name || userInfo.given_name || email.split("@")[0]).slice(0, 255);

  return { email, name };
};
