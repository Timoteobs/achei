import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { createRoom } from "../../services/rooms";
import type { RoomResponse, SaveRoomRequest } from "../../services/rooms";
import { useAuthStore } from "../../stores/auth-store";

export function useCreateRoomMutation(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "rooms", spaceId, "create"],
    mutationFn: (values: SaveRoomRequest) => createRoom(spaceId, values),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (room, _values, context) => {
      const userId = context?.userId;
      if (!userId) return;
      const listKey = ["spaces", userId, "rooms", spaceId, "list"];
      await queryClient.cancelQueries({ queryKey: listKey, exact: true });
      if (useAuthStore.getState().session?.user.id !== userId) return;

      queryClient.setQueryData<RoomResponse[]>(listKey, (previous) =>
        previous ? [...previous.filter(({ id }) => id !== room.id), room] : undefined,
      );
      void queryClient.invalidateQueries({ queryKey: listKey, exact: true });
      toast.success("Ambiente criado com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 400) {
          toast.warning("Confira os dados do ambiente e tente novamente.");
          return;
        }
        if (error.response?.status === 404) {
          toast.warning("Espaço não encontrado ou sem permissão de acesso.");
          return;
        }
      }
      toast.error("Não foi possível criar o ambiente. Tente novamente.");
    },
  });
}
