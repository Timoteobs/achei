import { createFileRoute } from "@tanstack/react-router";
import { ActivityPage } from "../pages/activity/activity-page";

export const Route = createFileRoute("/_app/atividade")({
  component: ActivityPage,
});
