import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { registerAccount } from "../../services/auth";
import { useAuthStore } from "../../stores/auth-store";

export function useRegisterMutation() {
  return useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: registerAccount,
    retry: false,
    networkMode: "always",
    gcTime: 0,
    onSuccess: (session) => {
      useAuthStore.getState().setSession(session);
      toast.success("Conta criada com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.warning("Este e-mail já está cadastrado. Entre na sua conta.");
      } else {
        toast.error("Não foi possível criar sua conta. Tente novamente.");
      }
    },
  });
}
