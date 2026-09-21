import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";

export type RoomCardVariant =
  "blue" | "green" | "purple" | "cyan" | "orange" | "teal";

export interface RoomCardProps {
  name: string;
  itemsCount: number;
  icon: LucideIcon;
  variant?: RoomCardVariant;
}

const variantStyles = {
  blue: { bg: "info.50", color: "info.700" },
  green: { bg: "success.50", color: "success.700" },
  purple: { bg: "purple.50", color: "purple.700" },
  cyan: { bg: "cyan.50", color: "cyan.700" },
  orange: { bg: "warning.50", color: "warning.700" },
  teal: { bg: "brand.subtle", color: "brand.fg" },
} satisfies Record<RoomCardVariant, { bg: string; color: string }>;

export function RoomCard({
  name,
  itemsCount,
  icon: Icon,
  variant = "teal",
}: Readonly<RoomCardProps>) {
  return (
    <Flex
      as="article"
      {...variantStyles[variant]}
      w="36"
      minH="32"
      h="full"
      flexShrink="0"
      direction="column"
      align="center"
      justify="center"
      p="3"
      borderRadius="md"
      textAlign="center"
    >
      <Box mb="3" aria-hidden="true">
        <Icon size={28} strokeWidth={1.8} />
      </Box>
      <Heading
        as="h3"
        fontSize="sm"
        fontWeight="semibold"
        lineHeight="short"
        color="fg.default"
        overflowWrap="anywhere"
      >
        {name}
      </Heading>
      <Text color="fg.muted" fontSize="sm" mt="1">
        {itemsCount} {itemsCount === 1 ? "item" : "itens"}
      </Text>
    </Flex>
  );
}
