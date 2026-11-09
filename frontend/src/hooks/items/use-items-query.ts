import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../services/items";
import type { ListItemsRequest } from "../../services/items";
import { useAuthStore } from "../../stores/auth-store";

export function useItemsQuery(spaceId: string, params: ListItemsRequest) {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["spaces", userId, "items", spaceId, "list", params],
    queryFn: ({ signal }) => getItems(spaceId, params, signal),
    enabled: !!userId && !!spaceId && params.locationId > 0,
    staleTime: 30000,
    retry: false,
    networkMode: "always",
    meta: {
      errorMessage: "Não foi possível carregar os itens.",
      notFoundMessage: "Caixa ou espaço indisponível.",
    },
  });
}
