import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { respondToInvitation } from "../../services/invitations";
import type { InvitationDecision, ReceivedInvitationResponse } from "../../services/invitations";
import { useAuthStore } from "../../stores/auth-store";

export function useRespondToInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["invitations", "respond"],
    mutationFn: ({ id, decision }: { id: number; decision: InvitationDecision }) => respondToInvitation(id, decision),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (response, _values, context) => {
      const userId = context?.userId;
      if (!userId || useAuthStore.getState().session?.user.id !== userId) return;
      const receivedKey = ["invitations", userId, "received"];
      await queryClient.cancelQueries({ queryKey: receivedKey, exact: true });
      if (useAuthStore.getState().session?.user.id !== userId) return;
      queryClient.setQueryData<ReceivedInvitationResponse[]>(receivedKey, (previous) =>
        previous?.map((invitation) => invitation.id === response.id ? { ...invitation, ...response } : invitation),
      );
      void queryClient.invalidateQueries({ queryKey: receivedKey, exact: true });
      void queryClient.invalidateQueries({ queryKey: ["spaces", userId, "invitations", String(response.spaceId), "list"], exact: true });
      if (response.status === "ACCEPTED") {
        void queryClient.invalidateQueries({ queryKey: ["spaces", userId, "detail", String(response.spaceId)], exact: true });
        void queryClient.invalidateQueries({ queryKey: ["spaces", userId, "list"], exact: true });
      }
      toast.success(response.status === "ACCEPTED" ? "Convite aceito com sucesso!" : "Convite rejeitado.");
    },
    onError: (error, _values, context) => {
      const userId = context?.userId;
      if (!userId || useAuthStore.getState().session?.user.id !== userId) return;
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 404 || error.response?.status === 409) {
          void queryClient.invalidateQueries({ queryKey: ["invitations", userId, "received"], exact: true });
          toast.warning("Este convite expirou, foi alterado ou já foi respondido. Confira a lista atualizada.");
          return;
        }
        if (error.response?.status === 403) {
          toast.warning("Você não tem permissão para responder a este convite.");
          return;
        }
      }
      toast.error("Não foi possível responder ao convite. Tente novamente.");
    },
  });
}
