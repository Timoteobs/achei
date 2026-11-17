import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { revokeInvitation } from "../../services/invitations";
import type { InvitationResponse } from "../../services/invitations";
import { useAuthStore } from "../../stores/auth-store";

export function useRevokeInvitationMutation(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "invitations", spaceId, "revoke"],
    mutationFn: (invitationId: number) => revokeInvitation(spaceId, invitationId),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (invitation, _, context) => {
      const userId = context?.userId;
      if (!userId || useAuthStore.getState().session?.user.id !== userId) return;
      const listKey = ["spaces", userId, "invitations", spaceId, "list"];
      await queryClient.cancelQueries({ queryKey: listKey, exact: true });
      if (useAuthStore.getState().session?.user.id !== userId) return;
      queryClient.setQueryData<InvitationResponse[]>(listKey, (previous) =>
        previous?.map((current) => current.id === invitation.id ? invitation : current),
      );
      void queryClient.invalidateQueries({ queryKey: listKey, exact: true });
      void queryClient.invalidateQueries({ queryKey: ["spaces", userId, "detail", spaceId], exact: true });
      toast.success("Acesso revogado!", {
        description: "A pessoa não tem mais acesso a este espaço.",
      });
    },
    onError: (error, _, context) => {
      const userId = context?.userId;
      if (!userId || useAuthStore.getState().session?.user.id !== userId) return;
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) return;
        if (status === 403 || status === 404 || status === 409) {
          void queryClient.invalidateQueries({ queryKey: ["spaces", userId] });
          toast.warning(status === 409
            ? "Não foi possível revogar este acesso. O convite pode ter sido alterado ou possuir uma restrição."
            : "Convite ou espaço não encontrado ou sem permissão de acesso.");
          return;
        }
      }
      toast.error("Não foi possível revogar o acesso. Tente novamente.");
    },
  });
}
