import { createFileRoute } from "@tanstack/react-router";
import { SpacesPage } from "../pages/spaces/spaces-page";

export const Route = createFileRoute("/_app/espacos/")({
  component: SpacesPage,
});
