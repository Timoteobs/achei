import axios from "axios";
import { useAuthStore } from "../stores/auth-store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.url === "/auth/login" || config.url === "/auth/register") return config;

  const auth = useAuthStore.getState();
  if (auth.session && auth.isAuthenticated()) {
    config.headers.set("Authorization", `Bearer ${auth.session.accessToken}`);
  } else if (auth.session) {
    auth.signOut("expired");
  }
  return config;
});

api.interceptors.response.use(undefined, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    const auth = useAuthStore.getState();
    if (
      auth.session &&
      error.config?.headers.get("Authorization") ===
        `Bearer ${auth.session.accessToken}`
    ) {
      auth.signOut("expired");
    }
  }
  return Promise.reject(error);
});
