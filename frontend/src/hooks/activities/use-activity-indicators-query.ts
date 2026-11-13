import { useQuery } from "@tanstack/react-query";
import { getActivityIndicators } from "../../services/activities";
import { useAuthStore } from "../../stores/auth-store";

export function useActivityIndicatorsQuery(spaceId: string) {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["spaces", userId, "activities", spaceId, "indicators"],
    queryFn: ({ signal }) => getActivityIndicators(spaceId, signal),
    enabled: !!userId && !!spaceId,
    staleTime: 30000,
    refetchOnMount: "always",
    retry: false,
    networkMode: "always",
    meta: {
      errorMessage: "Não foi possível carregar os indicadores.",
      notFoundMessage: "Espaço indisponível.",
    },
  });
}
