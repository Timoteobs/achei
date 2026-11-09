import { Box, Flex, Heading, IconButton, Menu, Portal, Text } from "@chakra-ui/react";
import { ChevronRight, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { colorVariantStyles } from "../color-variants";
import type { ColorVariant } from "../color-variants";

export type RoomCardVariant = ColorVariant;

export interface RoomCardProps {
  name: string;
  itemsCount?: number;
  boxesCount?: number;
  icon: LucideIcon;
  variant?: RoomCardVariant;
  layout?: "compact" | "detailed";
  onDelete?: () => void;
  onEdit?: () => void;
}

const variantStyles = colorVariantStyles;

export function RoomCard({
  name,
  itemsCount,
  boxesCount,
  icon: Icon,
  variant = "teal",
  layout = "compact",
  onDelete,
  onEdit,
}: Readonly<RoomCardProps>) {
  const counts = [
    itemsCount !== undefined ? `${itemsCount} ${itemsCount === 1 ? "item" : "itens"}` : null,
    boxesCount !== undefined ? `${boxesCount} ${boxesCount === 1 ? "caixa" : "caixas"}` : null,
  ].filter((count) => count !== null).join(" • ");

  const actions = (onEdit || onDelete) && (
    <Menu.Root positioning={{ placement: "bottom-end" }}>
      <Menu.Trigger asChild>
        <IconButton
          type="button"
          aria-label={`Ações de ${name}`}
          variant="ghost"
          size="xs"
          color="fg.muted"
          flexShrink="0"
          _hover={{ bg: "bg.subtle", color: "fg.default" }}
        >
          <MoreVertical size={16} strokeWidth={1.8} aria-hidden="true" />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content bg="bg.surface" borderColor="border.default" borderWidth="1px">
            {onEdit && (
              <Menu.Item
                value="edit"
                color="fg.default"
                gap="2"
                onSelect={onEdit}
                _highlighted={{ bg: "bg.subtle", color: "fg.default" }}
              >
                <Pencil size={16} aria-hidden="true" />
                Editar
              </Menu.Item>
            )}
            {onDelete && (
              <Menu.Item
                value="delete"
                color="danger.700"
                gap="2"
                onSelect={onDelete}
                _highlighted={{ bg: "danger.50", color: "danger.700" }}
              >
                <Trash2 size={16} aria-hidden="true" />
                Excluir
              </Menu.Item>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );

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
            {actions}
          </Flex>
          <Flex align="end" justify="space-between" gap="2">
            <Text color="fg.muted" fontSize="sm" truncate>
              {counts}
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
      position="relative"
      w="36"
      minH="32"
      h="full"
      flexShrink="0"
      direction="column"
      align="center"
      justify="center"
      p="3"
      pt={onEdit || onDelete ? "8" : "3"}
      borderRadius="md"
      textAlign="center"
    >
      {actions && <Box position="absolute" top="1" right="1">{actions}</Box>}
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
        {counts}
      </Text>
    </Flex>
  );
}
