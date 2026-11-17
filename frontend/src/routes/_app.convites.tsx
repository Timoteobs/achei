import { createFileRoute } from "@tanstack/react-router";
import { InvitationsPage } from "../pages/invitations/invitations-page";

export const Route = createFileRoute("/_app/convites")({
  component: InvitationsPage,
});
