import type { SpaceResponse } from "../services/spaces";

export function getSpacePermissions(space?: Pick<SpaceResponse, "role">) {
  const isOwner = space?.role === "OWNER";
  return {
    isOwner,
    canEdit: isOwner || space?.role === "EDITOR",
    role: space?.role,
  };
}
