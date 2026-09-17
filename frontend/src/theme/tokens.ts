import { defineTokens } from "@chakra-ui/react";

export const tokens = defineTokens({
  colors: {
    brand: {
      50: { value: "#EAF7F3" },
      100: { value: "#D2EFE7" },
      200: { value: "#A5DFD1" },
      300: { value: "#74CFBA" },
      400: { value: "#34D399" },
      500: { value: "#10B981" },
      600: { value: "#0B8F72" },
      700: { value: "#0B6B5A" },
      800: { value: "#085447" },
      900: { value: "#063F36" },
      950: { value: "#032A24" },
    },

    neutral: {
      0: { value: "#FFFFFF" },
      50: { value: "#F8FAFB" },
      100: { value: "#F1F5F6" },
      200: { value: "#E2E8EA" },
      300: { value: "#CBD5D8" },
      400: { value: "#94A3A8" },
      500: { value: "#64748B" },
      600: { value: "#475569" },
      700: { value: "#334155" },
      800: { value: "#1F2937" },
      900: { value: "#111827" },
      950: { value: "#08141C" },
    },

    success: {
      50: { value: "#ECFDF5" },
      500: { value: "#10B981" },
      700: { value: "#047857" },
    },

    warning: {
      50: { value: "#FFFBEB" },
      500: { value: "#F59E0B" },
      700: { value: "#B45309" },
    },

    danger: {
      50: { value: "#FEF2F2" },
      500: { value: "#EF4444" },
      700: { value: "#B91C1C" },
    },

    info: {
      50: { value: "#EFF6FF" },
      500: { value: "#3B82F6" },
      700: { value: "#1D4ED8" },
    },
  },

  fonts: {
    heading: {
      value: "'Inter Variable', Inter, system-ui, sans-serif",
    },
    body: {
      value: "'Inter Variable', Inter, system-ui, sans-serif",
    },
  },

  fontWeights: {
    regular: { value: "400" },
    medium: { value: "500" },
    semibold: { value: "600" },
    bold: { value: "700" },
  },

  radii: {
    xs: { value: "4px" },
    sm: { value: "8px" },
    md: { value: "12px" },
    lg: { value: "16px" },
    xl: { value: "20px" },
    "2xl": { value: "24px" },
    full: { value: "9999px" },
  },

  shadows: {
    xs: {
      value: "0 1px 2px rgba(8, 20, 28, 0.05)",
    },

    sm: {
      value: "0 1px 3px rgba(8, 20, 28, 0.08), 0 1px 2px rgba(8, 20, 28, 0.04)",
    },

    md: {
      value: "0 4px 12px rgba(8, 20, 28, 0.08), 0 2px 4px rgba(8, 20, 28, 0.04)",
    },

    lg: {
      value: "0 12px 32px rgba(8, 20, 28, 0.10), 0 4px 8px rgba(8, 20, 28, 0.04)",
    },
  },

  spacing: {
    0: { value: "0" },
    1: { value: "4px" },
    2: { value: "8px" },
    3: { value: "12px" },
    4: { value: "16px" },
    5: { value: "20px" },
    6: { value: "24px" },
    8: { value: "32px" },
    10: { value: "40px" },
    12: { value: "48px" },
    16: { value: "64px" },
    20: { value: "80px" },
  },
});
