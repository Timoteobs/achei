import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { createInvitation } from "../../services/invitations";
import type { InvitationResponse, SaveInvitationRequest } from "../../services/invitations";
import { useAuthStore } from "../../stores/auth-store";

export function useCreateInvitationMutation(spaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["spaces", "invitations", spaceId, "create"],
    mutationFn: (values: SaveInvitationRequest) => createInvitation(spaceId, values),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (invitation, _values, context) => {
      const userId = context?.userId;
      if (!userId || useAuthStore.getState().session?.user.id !== userId) return;
      const listKey = ["spaces", userId, "invitations", spaceId, "list"];
      await queryClient.cancelQueries({ queryKey: listKey, exact: true });
      if (useAuthStore.getState().session?.user.id !== userId) return;
      queryClient.setQueryData<InvitationResponse[]>(listKey, (previous) =>
        previous ? [invitation, ...previous.filter(({ id }) => id !== invitation.id)] : undefined,
      );
      void queryClient.invalidateQueries({ queryKey: listKey, exact: true });
      toast.success("Convite criado com sucesso!", {
        description: "O envio por e-mail ainda não está disponível.",
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 400) {
          toast.warning("Confira os dados do convite e tente novamente.");
          return;
        }
        if (error.response?.status === 403 || error.response?.status === 404) {
          toast.warning("Espaço não encontrado ou sem permissão para convidar membros.");
          return;
        }
        if (error.response?.status === 409) {
          toast.warning("Não foi possível criar o convite. Verifique os convites existentes.");
          return;
        }
      }
      toast.error("Não foi possível criar o convite. Tente novamente.");
    },
  });
}
