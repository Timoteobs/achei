import type { CSSProperties } from "react";
import { Toaster as SonnerToaster } from "sonner";
import { system } from "../../theme";

export function Toaster() {
  return (
    <SonnerToaster
      theme="light"
      position="top-right"
      richColors
      closeButton
      duration={5000}
      visibleToasts={3}
      offset={24}
      mobileOffset={16}
      containerAriaLabel="Notificações"
      toastOptions={{
        closeButtonAriaLabel: "Fechar notificação",
        style: {
          fontFamily: system.token.var("fonts.body"),
          boxShadow: system.token.var("shadows.md"),
        },
      }}
      style={{
        "--border-radius": system.token.var("radii.md"),
        "--normal-bg": system.token.var("colors.bg.surface"),
        "--normal-text": system.token.var("colors.fg.default"),
        "--normal-border": system.token.var("colors.border.default"),
        "--success-bg": system.token.var("colors.success.50"),
        "--success-text": system.token.var("colors.success.700"),
        "--success-border": system.token.var("colors.border.default"),
        "--info-bg": system.token.var("colors.info.50"),
        "--info-text": system.token.var("colors.info.700"),
        "--info-border": system.token.var("colors.border.default"),
        "--warning-bg": system.token.var("colors.warning.50"),
        "--warning-text": system.token.var("colors.warning.700"),
        "--warning-border": system.token.var("colors.border.default"),
        "--error-bg": system.token.var("colors.danger.50"),
        "--error-text": system.token.var("colors.danger.700"),
        "--error-border": system.token.var("colors.border.default"),
      } as CSSProperties}
    />
  );
}
