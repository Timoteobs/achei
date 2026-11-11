import { useInfiniteQuery } from "@tanstack/react-query";
import { getActivities } from "../../services/activities";
import { useAuthStore } from "../../stores/auth-store";

export function useActivitiesQuery(spaceId: string) {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useInfiniteQuery({
    queryKey: ["spaces", userId, "activities", spaceId, "infinite"],
    queryFn: ({ signal, pageParam }) => getActivities(spaceId, { page: pageParam, pageSize: 20 }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!userId && !!spaceId,
    staleTime: 30000,
    refetchOnMount: "always",
    retry: false,
    networkMode: "always",
    meta: {
      errorMessage: "Não foi possível carregar as atividades.",
      notFoundMessage: "Espaço indisponível.",
    },
  });
}
