import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { deleteBox } from "../../services/boxes";
import type { BoxResponse } from "../../services/boxes";
import { useAuthStore } from "../../stores/auth-store";

export function useDeleteBoxMutation(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "boxes", spaceId, "delete"],
    mutationFn: (boxId: number) => deleteBox(spaceId, boxId),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (_, boxId, context) => {
      const userId = context?.userId;
      if (!userId) return;
      const boxesKey = ["spaces", userId, "boxes", spaceId, "list"];
      const roomsKey = ["spaces", userId, "rooms", spaceId, "list"];
      await Promise.all([
        queryClient.cancelQueries({ queryKey: boxesKey, exact: true }),
        queryClient.cancelQueries({ queryKey: roomsKey, exact: true }),
      ]);
      if (useAuthStore.getState().session?.user.id !== userId) return;

      queryClient.setQueryData<BoxResponse[]>(boxesKey, (previous) =>
        previous?.filter(({ id }) => id !== boxId),
      );
      void queryClient.invalidateQueries({ queryKey: boxesKey, exact: true });
      void queryClient.invalidateQueries({ queryKey: roomsKey, exact: true });
      toast.success("Caixa excluída com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 409) {
          toast.warning("Não é possível excluir esta caixa enquanto houver itens ou outros registros vinculados a ela.");
          return;
        }
        if (error.response?.status === 404) {
          toast.warning("Caixa ou espaço não encontrado ou sem permissão de acesso.");
          return;
        }
      }
      toast.error("Não foi possível excluir a caixa. Tente novamente.");
    },
  });
}
