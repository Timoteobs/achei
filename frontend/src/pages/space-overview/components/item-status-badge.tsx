import { Badge, Circle } from "@chakra-ui/react";

export type ItemStatus = "in-use" | "stored";

const statusStyles = {
  "in-use": {
    label: "Em uso",
    bg: "success.50",
    color: "success.700",
    dot: "success.500",
  },
  stored: {
    label: "Guardado",
    bg: "bg.subtle",
    color: "fg.muted",
    dot: "fg.subtle",
  },
} satisfies Record<
  ItemStatus,
  { label: string; bg: string; color: string; dot: string }
>;

export function ItemStatusBadge({
  status,
}: Readonly<{ status: ItemStatus }>) {
  const { label, bg, color, dot } = statusStyles[status];

  return (
    <Badge
      bg={bg}
      color={color}
      borderRadius="full"
      px="2.5"
      py="0.5"
      fontSize="xs"
      fontWeight="medium"
      display="inline-flex"
      alignItems="center"
      gap="1.5"
    >
      <Circle size="1.5" bg={dot} aria-hidden="true" />
      {label}
    </Badge>
  );
}
