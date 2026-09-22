import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { ChevronRight, MoreVertical } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type RoomCardVariant =
  "blue" | "green" | "purple" | "cyan" | "orange" | "teal" | "pink";

export interface RoomCardProps {
  name: string;
  itemsCount: number;
  boxesCount?: number;
  icon: LucideIcon;
  variant?: RoomCardVariant;
  layout?: "compact" | "detailed";
}

const variantStyles = {
  blue: { bg: "info.50", color: "info.700" },
  green: { bg: "success.50", color: "success.700" },
  purple: { bg: "purple.50", color: "purple.700" },
  cyan: { bg: "cyan.50", color: "cyan.700" },
  orange: { bg: "warning.50", color: "warning.700" },
  teal: { bg: "brand.subtle", color: "brand.fg" },
  pink: { bg: "pink.50", color: "pink.700" },
} satisfies Record<RoomCardVariant, { bg: string; color: string }>;

export function RoomCard({
  name,
  itemsCount,
  boxesCount,
  icon: Icon,
  variant = "teal",
  layout = "compact",
}: Readonly<RoomCardProps>) {
  if (layout === "detailed") {
    return (
      <Flex
        as="article"
        align="center"
        gap="4"
        w="full"
        minH="28"
        p="4"
        bg="bg.surface"
        borderWidth="1px"
        borderColor="border.default"
        borderRadius="md"
      >
        <Flex
          {...variantStyles[variant]}
          boxSize={{ base: "16", md: "20" }}
          flexShrink="0"
          align="center"
          justify="center"
          borderRadius="md"
          aria-hidden="true"
        >
          <Icon size={32} strokeWidth={1.8} />
        </Flex>
        <Flex direction="column" justify="space-between" flex="1" minW="0" alignSelf="stretch">
          <Flex align="start" justify="space-between" gap="2">
            <Heading
              as="h3"
              fontSize="sm"
              fontWeight="semibold"
              color="fg.default"
              truncate
            >
              {name}
            </Heading>
            <IconButton
              aria-label={`Mais opções de ${name}`}
              variant="ghost"
              size="xs"
              color="fg.muted"
              flexShrink="0"
              _hover={{ bg: "bg.subtle" }}
            >
              <MoreVertical size={16} strokeWidth={1.8} />
            </IconButton>
          </Flex>
          <Flex align="end" justify="space-between" gap="2">
            <Text color="fg.muted" fontSize="sm" truncate>
              {itemsCount} {itemsCount === 1 ? "item" : "itens"}
              {boxesCount !== undefined &&
                ` • ${boxesCount} ${boxesCount === 1 ? "caixa" : "caixas"}`}
            </Text>
            <Box color="fg.muted" flexShrink="0" aria-hidden="true">
              <ChevronRight size={18} strokeWidth={1.8} />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    );
  }

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
