import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { deleteItem } from "../../services/items";
import { useAuthStore } from "../../stores/auth-store";

export function useDeleteItemMutation(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "items", spaceId, "delete"],
    mutationFn: (itemId: number) => deleteItem(spaceId, itemId),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (_data, _itemId, context) => {
      const userId = context?.userId;
      if (!userId || useAuthStore.getState().session?.user.id !== userId) return;
      const itemsKey = ["spaces", userId, "items", spaceId, "list"];
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
      toast.success("Item excluído com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 409) {
          toast.warning("Não é possível excluir este item enquanto houver imagens, etiquetas ou outros registros vinculados a ele.");
          return;
        }
        if (error.response?.status === 404) {
          toast.warning("Item ou espaço não encontrado ou sem permissão de acesso.");
          return;
        }
      }
      toast.error("Não foi possível excluir o item. Tente novamente.");
    },
  });
}