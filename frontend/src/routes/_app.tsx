import { createFileRoute, redirect } from "@tanstack/react-router";
import App from "../App";
import { useAuthStore } from "../stores/auth-store";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated()) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  component: App,
});
