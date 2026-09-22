import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "../pages/notifications/notifications-page";

export const Route = createFileRoute("/_app/notificacoes")({
  component: NotificationsPage,
});
