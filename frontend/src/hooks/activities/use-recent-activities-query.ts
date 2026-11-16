import { useQuery } from "@tanstack/react-query";
import { getActivities } from "../../services/activities";
import { useAuthStore } from "../../stores/auth-store";

export function useRecentActivitiesQuery(spaceId: string) {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["spaces", userId, "activities", spaceId, "recent", 5],
    queryFn: ({ signal }) => getActivities(spaceId, { page: 1, pageSize: 5 }, signal),
    enabled: !!userId && !!spaceId,
    staleTime: 30000,
    refetchOnMount: "always",
    retry: false,
    networkMode: "always",
    meta: {
      errorMessage: "Não foi possível carregar as atividades do espaço.",
      notFoundMessage: "Espaço indisponível.",
    },
  });
}
