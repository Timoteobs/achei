import { useQuery } from "@tanstack/react-query";
import { getSpaces } from "../../services/spaces";
import { useAuthStore } from "../../stores/auth-store";

export function useSpacesQuery() {
  const userId = useAuthStore((state) => state.session?.user.id);

  return useQuery({
    queryKey: ["spaces", userId, "list"],
    queryFn: ({ signal }) => getSpaces(signal),
    enabled: !!userId,
    staleTime: 30000,
    retry: false,
    networkMode: "always",
    meta: { errorMessage: "Não foi possível carregar seus espaços." },
  });
}
