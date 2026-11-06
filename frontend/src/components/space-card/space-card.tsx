import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { House } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SpaceCardProps {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  membersCount?: number;
  itemsCount?: number;
  icon?: LucideIcon;
}

export function SpaceCard({
  name,
  description,
  imageUrl,
  membersCount,
  itemsCount,
  icon: Icon = House,
}: Readonly<SpaceCardProps>) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
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
          {name}
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
    </Box>
  );
}
