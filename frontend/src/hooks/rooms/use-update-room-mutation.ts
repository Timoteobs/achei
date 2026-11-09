import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { updateRoom } from "../../services/rooms";
import type { RoomResponse, SaveRoomRequest } from "../../services/rooms";
import { useAuthStore } from "../../stores/auth-store";

export function useUpdateRoomMutation(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "rooms", spaceId, "update"],
    mutationFn: ({ id, values }: { id: number; values: SaveRoomRequest }) =>
      updateRoom(spaceId, id, values),
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
        previous?.map((item) => item.id === room.id ? room : item),
      );
      void queryClient.invalidateQueries({ queryKey: listKey, exact: true });
      void queryClient.invalidateQueries({ queryKey: ["spaces", userId, "boxes", spaceId, "list"], exact: true });
      toast.success("Ambiente atualizado com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 400) {
          toast.warning("Confira os dados do ambiente e tente novamente.");
          return;
        }
        if (error.response?.status === 404) {
          toast.warning("Ambiente ou espaço não encontrado ou sem permissão de acesso.");
          return;
        }
      }
      toast.error("Não foi possível atualizar o ambiente. Tente novamente.");
    },
  });
}
