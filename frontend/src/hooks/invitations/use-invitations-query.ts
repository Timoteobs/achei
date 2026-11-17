import { useQuery } from "@tanstack/react-query";
import { getInvitations } from "../../services/invitations";
import { useAuthStore } from "../../stores/auth-store";

export function useInvitationsQuery(spaceId: string) {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["spaces", userId, "invitations", spaceId, "list"],
    queryFn: ({ signal }) => getInvitations(spaceId, signal),
    enabled: !!userId && !!spaceId,
    staleTime: 30000,
    refetchOnMount: "always",
    retry: false,
    networkMode: "always",
    meta: {
      errorMessage: "Não foi possível carregar os convites.",
      notFoundMessage: "Espaço não encontrado ou sem permissão de acesso.",
    },
  });
}
