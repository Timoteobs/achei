import { Badge, Box, Flex, Heading, IconButton, Menu, Portal, Text } from "@chakra-ui/react";
import { ChevronRight, MapPin, MoreVertical, Package, Pencil, Trash2 } from "lucide-react";
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
}

export function BoxCard({
  name,
  itemsCount,
  roomName,
  category,
  variant = "blue",
  onDelete,
  onEdit,
}: Readonly<BoxCardProps>) {
  const colors = colorVariantStyles[variant];

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
        {...colors}
        boxSize={{ base: "16", md: "20" }}
        flexShrink="0"
        align="center"
        justify="center"
        borderRadius="md"
        aria-hidden="true"
      >
        <Package size={32} strokeWidth={1.8} />
      </Flex>
      <Flex
        direction="column"
        justify="space-between"
        flex="1"
        minW="0"
        alignSelf="stretch"
        gap="1"
      >
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

        <Box minW="0">
          <Text color="fg.muted" fontSize="sm" truncate>
            {itemsCount} {itemsCount === 1 ? "item" : "itens"}
          </Text>
          <Flex align="center" gap="1" color="fg.muted" mt="0.5" minW="0">
            <MapPin size={13} strokeWidth={1.8} aria-hidden="true" />
            <Text as="span" fontSize="xs" truncate>
              {roomName}
            </Text>
          </Flex>
        </Box>

        <Flex align="center" justify="space-between" gap="2">
          {category && <Badge
            {...colors}
            borderRadius="full"
            px="2.5"
            py="0.5"
            fontSize="xs"
            fontWeight="medium"
          >
            {category}
          </Badge>}
          <Box color="fg.muted" flexShrink="0" aria-hidden="true">
            <ChevronRight size={18} strokeWidth={1.8} />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
