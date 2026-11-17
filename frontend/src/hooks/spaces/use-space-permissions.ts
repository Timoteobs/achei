import { useParams } from "@tanstack/react-router";
import { getSpacePermissions } from "../../utils/space-permissions";
import { useSpaceQuery } from "./use-space-query";

export function useSpacePermissions(providedSpaceId?: string) {
  const { spaceId: routeSpaceId } = useParams({ strict: false });
  const query = useSpaceQuery(providedSpaceId ?? routeSpaceId ?? "");
  return getSpacePermissions(query.isSuccess ? query.data : undefined);
}
