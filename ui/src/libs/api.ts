import axios from "axios";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) useAuthStore.getState().clearAuth();
    return Promise.reject(error);
  },
);
