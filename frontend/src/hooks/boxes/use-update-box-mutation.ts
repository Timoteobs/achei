import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { updateBox } from "../../services/boxes";
import type { BoxResponse, SaveBoxRequest } from "../../services/boxes";
import { useAuthStore } from "../../stores/auth-store";

export function useUpdateBoxMutation(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["spaces", "boxes", spaceId, "update"],
    mutationFn: ({ id, values }: { id: number; values: SaveBoxRequest }) =>
      updateBox(spaceId, id, values),
    retry: false,
    networkMode: "always",
    onMutate: () => ({ userId: useAuthStore.getState().session?.user.id }),
    onSuccess: async (box, _values, context) => {
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
        previous?.map((item) => item.id === box.id ? box : item),
      );
      void queryClient.invalidateQueries({ queryKey: boxesKey, exact: true });
      void queryClient.invalidateQueries({ queryKey: roomsKey, exact: true });
      toast.success("Caixa atualizada com sucesso!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) return;
        if (error.response?.status === 400) {
          toast.warning("Confira os dados da caixa e tente novamente.");
          return;
        }
        if (error.response?.status === 404) {
          toast.warning("Caixa, ambiente ou espaço não encontrado ou sem permissão de acesso.");
          return;
        }
      }
      toast.error("Não foi possível atualizar a caixa. Tente novamente.");
    },
  });
}
