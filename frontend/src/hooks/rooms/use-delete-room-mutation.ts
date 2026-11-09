import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { deleteRoom } from "../../services/rooms";
import type { RoomResponse } from "../../services/rooms";
import { useAuthStore } from "../../stores/auth-store";

export function useDeleteRoomMutation(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "rooms", spaceId, "delete"],
    mutationFn: (roomId: number) => deleteRoom(spaceId, roomId),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (_, roomId, context) => {
      const userId = context?.userId;
      if (!userId) return;
      const listKey = ["spaces", userId, "rooms", spaceId, "list"];
      await queryClient.cancelQueries({ queryKey: listKey, exact: true });
      if (useAuthStore.getState().session?.user.id !== userId) return;

      queryClient.setQueryData<RoomResponse[]>(listKey, (previous) =>
        previous?.filter(({ id }) => id !== roomId),
      );
      void queryClient.invalidateQueries({ queryKey: listKey, exact: true });
      toast.success("Ambiente excluído com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 409) {
          toast.warning("Não é possível excluir este ambiente enquanto houver caixas, itens ou outros registros vinculados a ele.");
          return;
        }
        if (error.response?.status === 404) {
          toast.warning("Ambiente ou espaço não encontrado ou sem permissão de acesso.");
          return;
        }
      }
      toast.error("Não foi possível excluir o ambiente. Tente novamente.");
    },
  });
}
