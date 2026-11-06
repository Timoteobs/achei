import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { login } from "../../services/auth";
import type { LoginRequest } from "../../services/auth";
import { useAuthStore } from "../../stores/auth-store";

type LoginVariables = LoginRequest & { rememberMe: boolean };

export function useLoginMutation() {
  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: ({ email, password }: LoginVariables) =>
      login({ email, password }),
    retry: false,
    networkMode: "always",
    gcTime: 0,
    onSuccess: (session, { rememberMe }) => {
      useAuthStore.getState().setSession(session, rememberMe);
      toast.success("Login realizado com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.warning("E-mail ou senha inválidos.");
      } else {
        toast.error("Não foi possível entrar. Tente novamente.");
      }
    },
  });
}
