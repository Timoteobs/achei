import { createFileRoute } from "@tanstack/react-router";
import { ActivityPage } from "../pages/activity/activity-page";

export const Route = createFileRoute("/_app/atividade")({
  validateSearch: (search: Record<string, unknown>): { spaceId?: number } => {
    const spaceId = Number(search.spaceId);
    return Number.isSafeInteger(spaceId) && spaceId > 0 ? { spaceId } : {};
  },
  component: ActivityPage,
});
