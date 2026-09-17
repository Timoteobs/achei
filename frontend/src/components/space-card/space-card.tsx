import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { House } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SpaceCardProps {
  name: string;
  membersCount: number;
  itemsCount: number;
  icon?: LucideIcon;
}

export function SpaceCard({
  name,
  membersCount,
  itemsCount,
  icon: Icon = House,
}: Readonly<SpaceCardProps>) {
  return (
    <Box
      as="article"
      w="60"
      minH="48"
      h="full"
      flexShrink="0"
      overflow="hidden"
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="md"
      boxShadow="xs"
      _hover={{ borderColor: "border.emphasized" }}
    >
      <Flex
        h="28"
        align="center"
        justify="center"
        bg="brand.subtle"
        color="brand.fg"
      >
        <Icon size={36} strokeWidth={1.5} aria-hidden="true" />
      </Flex>
      <Box p="3">
        <Heading
          as="h3"
          fontSize="sm"
          fontWeight="semibold"
          color="fg.default"
          lineClamp="2"
        >
          {name}
        </Heading>
        <Text fontSize="sm" color="fg.muted" mt="1">
          {membersCount} {membersCount === 1 ? "membro" : "membros"} ·{" "}
          {itemsCount} {itemsCount === 1 ? "item" : "itens"}
        </Text>
      </Box>
    </Box>
  );
}
