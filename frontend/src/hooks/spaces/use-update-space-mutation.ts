import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { updateSpace } from "../../services/spaces";
import type { SaveSpaceRequest, SpaceResponse } from "../../services/spaces";
import { useAuthStore } from "../../stores/auth-store";

export function useUpdateSpaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "update"],
    mutationFn: ({ id, values }: { id: number; values: SaveSpaceRequest }) =>
      updateSpace(id, values),
    retry: false,
    networkMode: "always",
    onSuccess: async (space) => {
      const listKey = ["spaces", space.ownerUserId, "list"];
      const detailKey = ["spaces", space.ownerUserId, "detail", String(space.id)];
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey, exact: true }),
        queryClient.cancelQueries({ queryKey: detailKey, exact: true }),
      ]);
      if (useAuthStore.getState().session?.user.id !== space.ownerUserId) return;

      queryClient.setQueryData<SpaceResponse[]>(listKey, (previous) =>
        previous?.map((item) => item.id === space.id ? space : item),
      );
      queryClient.setQueryData(detailKey, space);
      void queryClient.invalidateQueries({ queryKey: listKey, exact: true });
      toast.success("Espaço atualizado com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 400) {
          toast.warning("Confira os dados do espaço e tente novamente.");
          return;
        }
        if (error.response?.status === 404) {
          toast.warning("Espaço não encontrado ou sem permissão de acesso.");
          return;
        }
      }
      toast.error("Não foi possível atualizar o espaço. Tente novamente.");
    },
  });
}
