import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { createItem } from "../../services/items";
import type { CreateItemRequest } from "../../services/items";
import { useAuthStore } from "../../stores/auth-store";

export function useCreateItemMutation(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "items", spaceId, "create"],
    mutationFn: (values: CreateItemRequest) => createItem(spaceId, values),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (_item, _values, context) => {
      const userId = context?.userId;
      if (!userId || useAuthStore.getState().session?.user.id !== userId) return;
      const boxesKey = ["spaces", userId, "boxes", spaceId, "list"];
      const itemsKey = ["spaces", userId, "items", spaceId, "list"];
      await Promise.all([
        queryClient.cancelQueries({ queryKey: boxesKey, exact: true }),
        queryClient.cancelQueries({ queryKey: itemsKey }),
      ]);
      if (useAuthStore.getState().session?.user.id !== userId) return;
      void queryClient.invalidateQueries({ queryKey: boxesKey, exact: true });
      void queryClient.invalidateQueries({ queryKey: itemsKey });
      toast.success("Item cadastrado com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 400) {
          toast.warning("Confira os dados do item e tente novamente.");
          return;
        }
        if (error.response?.status === 404) {
          toast.warning("Espaço ou local indisponível. Confira onde o item será guardado.");
          return;
        }
      }
      toast.error("Não foi possível cadastrar o item. Tente novamente.");
    },
  });
}
