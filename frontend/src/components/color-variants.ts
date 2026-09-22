export type ColorVariant =
  "blue" | "green" | "purple" | "cyan" | "orange" | "teal" | "pink";

export const colorVariantStyles = {
  blue: { bg: "info.50", color: "info.700" },
  green: { bg: "success.50", color: "success.700" },
  purple: { bg: "purple.50", color: "purple.700" },
  cyan: { bg: "cyan.50", color: "cyan.700" },
  orange: { bg: "warning.50", color: "warning.700" },
  teal: { bg: "brand.subtle", color: "brand.fg" },
  pink: { bg: "pink.50", color: "pink.700" },
} satisfies Record<ColorVariant, { bg: string; color: string }>;
