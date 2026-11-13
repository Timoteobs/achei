import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { updateItem } from "../../services/items";
import type { SaveItemRequest } from "../../services/items";
import { useAuthStore } from "../../stores/auth-store";

export function useUpdateItemMutation(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "items", spaceId, "update"],
    mutationFn: ({ id, values }: { id: number; values: SaveItemRequest }) =>
      updateItem(spaceId, id, values),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (_item, _values, context) => {
      const userId = context?.userId;
      if (!userId || useAuthStore.getState().session?.user.id !== userId) return;
      const itemsKey = ["spaces", userId, "items", spaceId];
      const boxesKey = ["spaces", userId, "boxes", spaceId, "list"];
      await Promise.all([
        queryClient.cancelQueries({ queryKey: itemsKey }),
        queryClient.cancelQueries({ queryKey: boxesKey, exact: true }),
      ]);
      if (useAuthStore.getState().session?.user.id !== userId) return;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: itemsKey }),
        queryClient.invalidateQueries({ queryKey: boxesKey, exact: true }),
      ]);
      if (useAuthStore.getState().session?.user.id !== userId) return;
      toast.success("Item atualizado com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 400) {
          toast.warning("Confira os dados do item e tente novamente.");
          return;
        }
        if (error.response?.status === 404) {
          toast.warning("Item, espaço, local ou categoria indisponível. Confira os dados e tente novamente.");
          return;
        }
      }
      toast.error("Não foi possível atualizar o item. Tente novamente.");
    },
  });
}
