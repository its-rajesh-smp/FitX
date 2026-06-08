import axios from "axios";

export function getAuthError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? "Unable to complete request";
  }

  return "Unable to complete request";
}
