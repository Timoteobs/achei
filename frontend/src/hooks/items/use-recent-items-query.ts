import { useQuery } from "@tanstack/react-query";
import { getRecentItems } from "../../services/items";
import { useAuthStore } from "../../stores/auth-store";

export function useRecentItemsQuery(spaceId: string, limit = 5) {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["spaces", userId, "items", spaceId, "recent", limit],
    queryFn: ({ signal }) => getRecentItems(spaceId, limit, signal),
    enabled: !!userId && !!spaceId,
    staleTime: 30000,
    retry: false,
    networkMode: "always",
    meta: {
      errorMessage: "Não foi possível carregar os itens recentes.",
      notFoundMessage: "Espaço não encontrado ou sem permissão de acesso.",
    },
  });
}
