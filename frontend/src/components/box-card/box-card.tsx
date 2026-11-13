import { Badge, Box, Flex, Heading, IconButton, Menu, Portal, Text, chakra } from "@chakra-ui/react";
import { Layers, MapPin, MoreVertical, Package, Pencil, Trash2 } from "lucide-react";
import { colorVariantStyles } from "../color-variants";
import type { ColorVariant } from "../color-variants";

export interface BoxCardProps {
  name: string;
  itemsCount: number;
  roomName: string;
  category?: string;
  variant?: ColorVariant;
  onDelete?: () => void;
  onEdit?: () => void;
  onOpen?: () => void;
}

export function BoxCard({
  name,
  itemsCount,
  roomName,
  category,
  variant = "blue",
  onDelete,
  onEdit,
  onOpen,
}: Readonly<BoxCardProps>) {
  const colors = colorVariantStyles[variant];

  return (
    <Flex
      as="article"
      position="relative"
      direction="column"
      w="full"
      h="full"
      minH="228px"
      p="2"
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="lg"
      boxShadow="xs"
      _hover={{ borderColor: "border.emphasized", boxShadow: "sm" }}
    >
      {onOpen && (
        <chakra.button
          type="button"
          aria-label={`Ver itens de ${name}`}
          position="absolute"
          inset="0"
          zIndex="1"
          borderRadius="inherit"
          cursor="pointer"
          onClick={onOpen}
          _focusVisible={{ outline: "2px solid", outlineColor: "brand.focusRing", outlineOffset: "2px" }}
        />
      )}
      <Flex
        {...colors}
        boxSize="16"
        mt="4"
        mx="3"
        mb="3"
        flexShrink="0"
        align="center"
        justify="center"
        borderRadius="xl"
        aria-hidden="true"
      >
        <Package size={40} strokeWidth={1.8} />
      </Flex>
      <Flex
        direction="column"
        flex="1"
        minW="0"
        alignSelf="stretch"
        gap="2"
        px="2"
        pb="6"
      >
        <Flex align="start" justify="space-between" gap="2">
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
          {(onEdit || onDelete) && (
            <Menu.Root positioning={{ placement: "bottom-end" }}>
              <Menu.Trigger asChild>
                <IconButton
                  type="button"
                  aria-label={`Ações de ${name}`}
                  variant="ghost"
                  size="xs"
                  color="fg.muted"
                  flexShrink="0"
                  position="absolute"
                  top="3"
                  right="2"
                  zIndex="2"
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
                    {onDelete && <Menu.Item
                      value="delete"
                      color="danger.700"
                      gap="2"
                      onSelect={onDelete}
                      _highlighted={{ bg: "danger.50", color: "danger.700" }}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Excluir
                    </Menu.Item>}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </Flex>

        <Flex align="center" gap="2" color="fg.muted" minW="0">
          <Box flexShrink="0" aria-hidden="true"><Layers size={18} strokeWidth={1.8} /></Box>
          <Text fontSize="sm">
            {itemsCount} {itemsCount === 1 ? "item" : "itens"}
          </Text>
        </Flex>

          {category && <Badge
            {...colors}
            borderRadius="full"
            px="2.5"
            py="0.5"
            fontSize="xs"
            fontWeight="medium"
            alignSelf="start"
          >
            {category}
          </Badge>}
      </Flex>
      <Flex align="center" gap="2" bg="brand.subtle" color="fg.muted" borderRadius="sm" minH="9" px="3" py="2" minW="0">
        <Box flexShrink="0" aria-hidden="true"><MapPin size={16} strokeWidth={1.8} /></Box>
        <Text fontSize="sm" truncate title={roomName}>{roomName}</Text>
      </Flex>
    </Flex>
  );
}
