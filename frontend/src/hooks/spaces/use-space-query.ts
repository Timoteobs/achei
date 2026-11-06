import { useQuery } from "@tanstack/react-query";
import { getSpace } from "../../services/spaces";
import { useAuthStore } from "../../stores/auth-store";

export function useSpaceQuery(spaceId: string) {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["spaces", userId, "detail", spaceId],
    queryFn: ({ signal }) => getSpace(spaceId, signal),
    enabled: !!userId,
    staleTime: 30000,
    retry: false,
    networkMode: "always",
    meta: {
      errorMessage: "Não foi possível carregar este espaço.",
      notFoundMessage: "Espaço não encontrado ou sem permissão de acesso.",
    },
  });
}
