import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "../pages/register/register-page";

export const Route = createFileRoute("/_auth/register")({
  component: RegisterPage,
});
