import { useQuery } from "@tanstack/react-query";
import { getBoxes } from "../../services/boxes";
import { useAuthStore } from "../../stores/auth-store";

export function useBoxesQuery(spaceId: string) {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["spaces", userId, "boxes", spaceId, "list"],
    queryFn: ({ signal }) => getBoxes(spaceId, signal),
    enabled: !!userId && !!spaceId,
    staleTime: 30000,
    retry: false,
    networkMode: "always",
    meta: {
      errorMessage: "Não foi possível carregar as caixas.",
      notFoundMessage: "Espaço não encontrado ou sem permissão de acesso.",
    },
  });
}
