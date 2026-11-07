import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { createSpace } from "../../services/spaces";
import type { SpaceResponse } from "../../services/spaces";
import { useAuthStore } from "../../stores/auth-store";

export function useCreateSpaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "create"],
    mutationFn: createSpace,
    retry: false,
    networkMode: "always",
    onSuccess: async (space) => {
      const listKey = ["spaces", space.ownerUserId, "list"];
      await queryClient.cancelQueries({ queryKey: listKey, exact: true });
      if (useAuthStore.getState().session?.user.id !== space.ownerUserId) return;

      queryClient.setQueryData<SpaceResponse[]>(listKey, (previous) =>
        previous ? [space, ...previous.filter(({ id }) => id !== space.id)] : undefined,
      );
      queryClient.setQueryData(
        ["spaces", space.ownerUserId, "detail", String(space.id)],
        space,
      );
      void queryClient.invalidateQueries({ queryKey: listKey, exact: true });
      toast.success("Espaço criado com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 400) {
          toast.warning("Confira os dados do espaço e tente novamente.");
          return;
        }
      }
      toast.error("Não foi possível criar o espaço. Tente novamente.");
    },
  });
}
