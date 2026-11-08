import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAuthError } from "@/features/auth/helpers/getAuthError";
import {
  GooglePopupClosedError,
  requestGoogleAccessToken,
} from "@/features/auth/helpers/googleIdentity";
import { googleAuth } from "@/features/auth/services/googleAuth";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.27a12 12 0 0 0 0 10.76l4.01-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.62l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  );
}

export function GoogleButton() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: async () => googleAuth(await requestGoogleAccessToken()),
    onSuccess: (auth) => {
      setAuth(auth);
      navigate("/chat", { replace: true });
    },
  });

  // Closing the popup is a choice, not an error worth showing.
  const error =
    mutation.error && !(mutation.error instanceof GooglePopupClosedError)
      ? getAuthError(mutation.error)
      : null;

  return (
    <div>
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-line-strong bg-surface text-[13px] font-semibold text-ink transition-colors hover:bg-sunken disabled:opacity-60"
      >
        <GoogleMark />
        {mutation.isPending ? "Connecting to Google..." : "Continue with Google"}
      </button>
      {error && <p className="mt-2 text-[12px] text-danger">{error}</p>}
    </div>
  );
}
