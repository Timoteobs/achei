import { Button as ChakraButton } from "@chakra-ui/react";
import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export type ButtonVariant = "solid" | "outline" | "link";

export interface ButtonProps extends Omit<ChakraButtonProps, "variant"> {
  variant?: ButtonVariant;
}

const variantStyle = {
  solid: {
    variant: "solid",
    w: "full",
    h: "48px",
    bg: "brand.solid",
    color: "brand.contrast",
    borderRadius: "md",
    fontSize: "sm",
    fontWeight: "semibold",
    gap: "2",
    _hover: { bg: "brand.800" },
    _active: { bg: "brand.900", transform: "scale(0.99)" },
    _focusVisible: {
      outlineColor: "brand.focusRing",
      outlineWidth: "2px",
      outlineOffset: "3px",
    },
    _disabled: { opacity: 0.55, cursor: "not-allowed" },
  },
  outline: {
    variant: "outline",
    h: "48px",
    bg: "bg.surface",
    color: "fg.default",
    borderColor: "border.default",
    borderRadius: "md",
    fontSize: "sm",
    fontWeight: "semibold",
    gap: "2",
    _hover: { bg: "bg.canvas", borderColor: "border.emphasized" },
    _focusVisible: {
      outlineColor: "brand.focusRing",
      outlineWidth: "2px",
      outlineOffset: "3px",
    },
    _disabled: { opacity: 0.55, cursor: "not-allowed" },
  },
  link: {
    variant: "plain",
    p: "0",
    h: "auto",
    minH: "36px",
    color: "brand.fg",
    fontSize: "13px",
    fontWeight: "medium",
    _hover: { textDecoration: "underline", textUnderlineOffset: "3px" },
  },
} satisfies Record<ButtonVariant, ChakraButtonProps>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "solid", ...props }, ref) {
    return <ChakraButton {...variantStyle[variant]} {...props} ref={ref} />;
  },
);
