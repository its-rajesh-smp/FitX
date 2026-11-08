const GIS_SRC = "https://accounts.google.com/gsi/client";

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

interface TokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface TokenClient {
  requestAccessToken: () => void;
}

interface GoogleOAuth2 {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse) => void;
    error_callback?: (error: { type: string; message?: string }) => void;
  }) => TokenClient;
}

declare global {
  interface Window {
    google?: { accounts: { oauth2: GoogleOAuth2 } };
  }
}

let scriptPromise: Promise<void> | null = null;

/** Loads Google Identity Services once; later calls reuse the same promise. */
export const loadGoogleIdentity = () => {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Couldn't reach Google. Check your connection and try again."));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};

export class GooglePopupClosedError extends Error {}

/** Opens Google's consent popup and resolves with an OAuth access token. */
export const requestGoogleAccessToken = async (): Promise<string> => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("Google sign-in isn't set up yet.");
  }

  await loadGoogleIdentity();
  const oauth2 = window.google?.accounts.oauth2;
  if (!oauth2) throw new Error("Google sign-in failed to load.");

  return new Promise<string>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: (response) => {
        if (response.access_token) resolve(response.access_token);
        else reject(new Error(response.error_description || "Google sign-in was cancelled."));
      },
      error_callback: (error) => {
        if (error.type === "popup_closed") reject(new GooglePopupClosedError());
        else reject(new Error(error.message || "Google sign-in failed. Please try again."));
      },
    });
    client.requestAccessToken();
  });
};
