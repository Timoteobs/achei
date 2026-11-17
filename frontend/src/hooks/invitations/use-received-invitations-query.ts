import { useQuery } from "@tanstack/react-query";
import { getReceivedInvitations } from "../../services/invitations";
import { useAuthStore } from "../../stores/auth-store";

export function useReceivedInvitationsQuery() {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["invitations", userId, "received"],
    queryFn: ({ signal }) => getReceivedInvitations(signal),
    enabled: !!userId,
    staleTime: 30000,
    refetchOnMount: "always",
    retry: false,
    networkMode: "always",
    meta: { errorMessage: "Não foi possível carregar seus convites." },
  });
}
