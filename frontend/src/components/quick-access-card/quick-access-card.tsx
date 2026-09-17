import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";

export type QuickAccessVariant =
  "recent" | "favorites" | "withoutPhoto" | "trash";

export interface QuickAccessCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  variant: QuickAccessVariant;
}

const variantStyles = {
  recent: { bg: "info.50", color: "info.700" },
  favorites: { bg: "warning.50", color: "warning.700" },
  withoutPhoto: { bg: "purple.50", color: "purple.700" },
  trash: { bg: "bg.subtle", color: "fg.muted" },
} satisfies Record<QuickAccessVariant, { bg: string; color: string }>;

export function QuickAccessCard({
  title,
  count,
  icon: Icon,
  variant,
}: Readonly<QuickAccessCardProps>) {
  return (
    <Flex
      as="article"
      {...variantStyles[variant]}
      align="center"
      gap="3"
      minW="0"
      minH="18"
      h="full"
      p="3"
      px={{ base: "3", xl: "4" }}
      borderRadius="md"
      borderWidth="1px"
      borderColor="transparent"
      _hover={{ borderColor: "border.emphasized" }}
    >
      <Box flexShrink="0" aria-hidden="true">
        <Icon size={22} strokeWidth={1.8} />
      </Box>
      <Box minW="0">
        <Heading
          as="h3"
          fontSize="sm"
          fontWeight="semibold"
          lineHeight="short"
          overflowWrap="anywhere"
        >
          {title}
        </Heading>
        <Text fontSize="xs" fontWeight="regular" color="fg.muted" mt="1">
          {count} {count === 1 ? "item" : "itens"}
        </Text>
      </Box>
    </Flex>
  );
}
