import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  LinkBox,
  LinkOverlay,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { EllipsisVertical, House, Pencil, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SpaceCardProps {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  membersCount?: number;
  itemsCount?: number;
  icon?: LucideIcon;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function SpaceCard({
  id,
  name,
  description,
  imageUrl,
  membersCount,
  itemsCount,
  icon: Icon = House,
  onDelete,
  onEdit,
}: Readonly<SpaceCardProps>) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  return (
    <LinkBox
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
      {(onEdit || onDelete) && (
        <Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger asChild>
            <IconButton
              type="button"
              aria-label={`Ações de ${name}`}
              position="absolute"
              top="2"
              right="2"
              zIndex="1"
              size="sm"
              variant="outline"
              bg="bg.surface"
              color="fg.muted"
              borderColor="border.default"
              _hover={{ bg: "bg.subtle", color: "fg.default" }}
            >
              <EllipsisVertical size={18} aria-hidden="true" />
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
      )}
      <Flex
        h="28"
        align="center"
        justify="center"
        bg="brand.subtle"
        color="brand.fg"
      >
        {imageUrl && imageUrl !== failedImage ? (
          <Image
            src={imageUrl}
            alt=""
            w="full"
            h="full"
            objectFit="cover"
            loading="lazy"
            onError={() => setFailedImage(imageUrl)}
          />
        ) : (
          <Icon size={36} strokeWidth={1.5} aria-hidden="true" />
        )}
      </Flex>
      <Box p="3">
        <Heading
          as="h3"
          fontSize="sm"
          fontWeight="semibold"
          color="fg.default"
          lineClamp="2"
        >
          <LinkOverlay asChild>
            <Link to="/espacos/$spaceId" params={{ spaceId: id }}>
              {name}
            </Link>
          </LinkOverlay>
        </Heading>
        {description && (
          <Text fontSize="sm" color="fg.muted" mt="1" lineClamp="2" overflowWrap="anywhere">
            {description}
          </Text>
        )}
        {membersCount !== undefined && itemsCount !== undefined && (
          <Text fontSize="sm" color="fg.muted" mt="1">
            {membersCount} {membersCount === 1 ? "membro" : "membros"} ·{" "}
            {itemsCount} {itemsCount === 1 ? "item" : "itens"}
          </Text>
        )}
      </Box>
    </LinkBox>
  );
}
