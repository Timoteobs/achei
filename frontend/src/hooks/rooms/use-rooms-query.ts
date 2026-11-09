import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../../services/rooms";
import { useAuthStore } from "../../stores/auth-store";

export function useRoomsQuery(spaceId: string) {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["spaces", userId, "rooms", spaceId, "list"],
    queryFn: ({ signal }) => getRooms(spaceId, signal),
    enabled: !!userId && !!spaceId,
    staleTime: 30000,
    retry: false,
    networkMode: "always",
    meta: {
      errorMessage: "Não foi possível carregar os ambientes.",
      notFoundMessage: "Espaço não encontrado ou sem permissão de acesso.",
    },
  });
}
