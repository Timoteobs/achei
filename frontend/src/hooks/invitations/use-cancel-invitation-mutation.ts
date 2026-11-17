import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { deleteInvitation } from "../../services/invitations";
import type { InvitationResponse } from "../../services/invitations";
import { useAuthStore } from "../../stores/auth-store";

export function useCancelInvitationMutation(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "invitations", spaceId, "delete"],
    mutationFn: (invitationId: number) => deleteInvitation(spaceId, invitationId),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (_, invitationId, context) => {
      const userId = context?.userId;
      if (!userId || useAuthStore.getState().session?.user.id !== userId) return;
      const listKey = ["spaces", userId, "invitations", spaceId, "list"];
      await queryClient.cancelQueries({ queryKey: listKey, exact: true });
      if (useAuthStore.getState().session?.user.id !== userId) return;
      queryClient.setQueryData<InvitationResponse[]>(listKey, (previous) =>
        previous?.filter(({ id }) => id !== invitationId),
      );
      void queryClient.invalidateQueries({ queryKey: listKey, exact: true });
      toast.success("Convite cancelado com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 403 || error.response?.status === 404) {
          toast.warning("Convite ou espaço não encontrado ou sem permissão de acesso.");
          return;
        }
        if (error.response?.status === 409) {
          toast.warning("Não é possível cancelar este convite enquanto houver registros vinculados a ele.");
          return;
        }
      }
      toast.error("Não foi possível cancelar o convite. Tente novamente.");
    },
  });
}
