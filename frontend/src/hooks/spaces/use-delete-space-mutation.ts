import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { deleteSpace } from "../../services/spaces";
import type { SpaceResponse } from "../../services/spaces";
import { useAuthStore } from "../../stores/auth-store";

export function useDeleteSpaceMutation(onDeleted?: () => void | Promise<void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "delete"],
    mutationFn: (space: Pick<SpaceResponse, "id" | "ownerUserId">) =>
      deleteSpace(space.id),
    retry: false,
    networkMode: "always",
    onSuccess: async (_, space) => {
      const listKey = ["spaces", space.ownerUserId, "list"];
      const detailKey = ["spaces", space.ownerUserId, "detail", String(space.id)];
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey, exact: true }),
        queryClient.cancelQueries({ queryKey: detailKey, exact: true }),
      ]);
      if (useAuthStore.getState().session?.user.id !== space.ownerUserId) return;

      queryClient.setQueryData<SpaceResponse[]>(listKey, (previous) =>
        previous?.filter(({ id }) => id !== space.id),
      );
      // Leave the detail page before removing its active query.
      await onDeleted?.();
      queryClient.removeQueries({ queryKey: detailKey, exact: true });
      void queryClient.invalidateQueries({ queryKey: listKey, exact: true });
      toast.success("Espaço excluído com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 409) {
          toast.warning(
            "Não é possível excluir este espaço enquanto houver registros vinculados a ele.",
          );
          return;
        }
        if (error.response?.status === 404) {
          toast.warning("Espaço não encontrado ou sem permissão de acesso.");
          return;
        }
      }
      toast.error("Não foi possível excluir o espaço. Tente novamente.");
    },
  });
}
