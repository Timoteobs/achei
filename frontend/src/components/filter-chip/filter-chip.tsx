import { Badge } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Button } from "../button/button";

export interface FilterChipProps {
  active?: boolean;
  badge?: number;
  children: ReactNode;
}

export function FilterChip({
  active = false,
  badge,
  children,
}: Readonly<FilterChipProps>) {
  return (
    <Button
      type="button"
      variant="link"
      aria-pressed={active}
      gap="1.5"
      w="auto"
      h={{ base: "10", md: "8" }}
      minH="0"
      px="4"
      flexShrink="0"
      borderRadius="sm"
      borderWidth="1px"
      borderColor={active ? "brand.emphasized" : "transparent"}
      bg={active ? "brand.subtle" : "bg.emphasized"}
      color={active ? "brand.fg" : "fg.muted"}
      fontSize="xs"
      fontWeight="medium"
      whiteSpace="nowrap"
      _hover={{ borderColor: active ? "brand.emphasized" : "border.default" }}
    >
      {children}
      {badge !== undefined && (
        <Badge
          bg="danger.500"
          color="brand.contrast"
          borderRadius="full"
          minW="6"
          h="6"
          px="1"
          fontSize="10px"
          lineHeight="1"
          fontWeight="semibold"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
        >
          {badge}
        </Badge>
      )}
    </Button>
  );
}
