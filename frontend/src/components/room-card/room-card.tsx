import {
  Box,
  Flex,
  Heading,
  IconButton,
  Menu,
  Portal,
  Text,
  chakra,
} from "@chakra-ui/react";
import {
  Box as BoxIcon,
  Layers,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
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
  onOpen?: () => void;
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
  onOpen,
}: Readonly<RoomCardProps>) {
  const counts = [
    itemsCount !== undefined
      ? `${itemsCount} ${itemsCount === 1 ? "item" : "itens"}`
      : null,
    boxesCount !== undefined
      ? `${boxesCount} ${boxesCount === 1 ? "caixa" : "caixas"}`
      : null,
  ]
    .filter((count) => count !== null)
    .join(" • ");

  const openButton = onOpen && (
    <chakra.button
      type="button"
      aria-label={`Ver caixas de ${name}`}
      position="absolute"
      inset="0"
      zIndex="1"
      borderRadius="inherit"
      cursor="pointer"
      onClick={onOpen}
      _hover={layout === "compact" ? { bg: "blackAlpha.50" } : undefined}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "brand.focusRing",
        outlineOffset: "2px",
      }}
    />
  );

  const actions = (onEdit || onDelete) && (
    <Menu.Root positioning={{ placement: "bottom-end" }}>
      <Menu.Trigger asChild>
        <IconButton
          type="button"
          aria-label={`Ações de ${name}`}
          variant="ghost"
          size="xs"
          color="fg.muted"
          bg={layout === "detailed" ? "bg.surface" : undefined}
          borderRadius="md"
          boxShadow={layout === "detailed" ? "xs" : undefined}
          flexShrink="0"
          position="relative"
          zIndex="2"
          _hover={{ bg: "bg.subtle", color: "fg.default" }}
        >
          <MoreVertical size={16} strokeWidth={1.8} aria-hidden="true" />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            bg="bg.surface"
            borderColor="border.default"
            borderWidth="1px"
          >
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
        position="relative"
        direction="column"
        w="full"
        h="full"
        minH="220px"
        bg="bg.surface"
        borderWidth="1px"
        borderColor="border.default"
        borderRadius="md"
        boxShadow="xs"
        _hover={{ borderColor: "border.emphasized", boxShadow: "sm" }}
      >
        {openButton}
        {actions && (
          <Box position="absolute" top="3" right="3" zIndex="2">
            {actions}
          </Box>
        )}
        <Flex
          {...variantStyles[variant]}
          h="120px"
          flexShrink="0"
          align="center"
          justify="center"
          borderTopRadius="md"
          aria-hidden="true"
        >
          <Icon size={42} strokeWidth={1.8} />
        </Flex>
        <Flex direction="column" gap="3" flex="1" minW="0" p="4">
          <Heading
            as="h3"
            fontSize="sm"
            fontWeight="semibold"
            color="fg.default"
            lineClamp="2"
            overflowWrap="anywhere"
          >
            {name}
          </Heading>
          <Flex
            align="center"
            gap="3"
            wrap="wrap"
            color="fg.muted"
            fontSize="sm"
            mt="auto"
          >
            {boxesCount !== undefined && (
              <Flex align="center" gap="2">
                <BoxIcon size={18} strokeWidth={1.8} aria-hidden="true" />
                <Text>
                  {boxesCount} {boxesCount === 1 ? "caixa" : "caixas"}
                </Text>
              </Flex>
            )}
            {boxesCount !== undefined && itemsCount !== undefined && (
              <Text aria-hidden="true">•</Text>
            )}
            {itemsCount !== undefined && (
              <Flex align="center" gap="2">
                <Layers size={18} strokeWidth={1.8} aria-hidden="true" />
                <Text>
                  {itemsCount} {itemsCount === 1 ? "item" : "itens"}
                </Text>
              </Flex>
            )}
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
      {openButton}
      {actions && (
        <Box position="absolute" top="1" right="1">
          {actions}
        </Box>
      )}
      <Box mb="3" aria-hidden="true">
        <Icon size={28} strokeWidth={1.8} />
      </Box>
      <Heading
        as="h3"
        fontSize="sm"
        fontWeight="semibold"
        lineClamp="2"
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
