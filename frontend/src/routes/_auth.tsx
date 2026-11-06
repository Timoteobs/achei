import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";

export const Route = createFileRoute("/_auth")({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated()) {
      throw redirect({ to: "/", replace: true });
    }
  },
  component: Outlet,
});
