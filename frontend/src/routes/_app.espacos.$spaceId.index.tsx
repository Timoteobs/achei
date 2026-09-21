import { createFileRoute } from "@tanstack/react-router";
import { SpaceOverviewPage } from "../pages/space-overview/space-overview-page";

export const Route = createFileRoute("/_app/espacos/$spaceId/")({
  component: SpaceOverviewPage,
});
