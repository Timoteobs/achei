import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AuthSession } from "../components/auth-session/auth-session";

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthSession />
      <Outlet />
    </>
  ),
});
