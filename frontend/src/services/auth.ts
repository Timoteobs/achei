import { api } from "./api";

export interface AuthSession {
  accessToken: string;
  expiresAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  confirmPassword: string;
}

export async function login(values: LoginRequest) {
  const { data } = await api.post<AuthSession>("/auth/login", values);
  return data;
}

export async function registerAccount(values: RegisterRequest) {
  const { data } = await api.post<AuthSession>("/auth/register", values);
  return data;
}
