import { Badge, Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { ArrowLeft, MapPin, MoreVertical, Package } from "lucide-react";
import { Button } from "../../../../components/button/button";
import { colorVariantStyles } from "../../../../components/color-variants";
import { selectedBoxMock } from "./selected-box-mock";

export function SelectedBoxContext() {
  const { name, roomName, itemsCount, category, variant = "blue" } =
    selectedBoxMock;
  const colors = colorVariantStyles[variant];

  return (
    <Box minW="0">
      <Button
        type="button"
        variant="link"
        color="fg.muted"
        gap="2"
        mb="3"
        _hover={{ color: "fg.default", textDecoration: "underline" }}
      >
        <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
        Voltar para Caixas
      </Button>

      <Flex
        as="section"
        align="center"
        gap="4"
        w="full"
        minH="20"
        p="4"
        bg="bg.surface"
        borderWidth="1px"
        borderColor="border.default"
        borderRadius="md"
      >
        <Flex
          {...colors}
          boxSize="14"
          flexShrink="0"
          align="center"
          justify="center"
          borderRadius="md"
          aria-hidden="true"
        >
          <Package size={26} strokeWidth={1.8} />
        </Flex>

        <Box flex="1" minW="0">
          <Heading
            as="h2"
            fontSize="sm"
            fontWeight="semibold"
            color="fg.default"
            truncate
          >
            {name}
          </Heading>
          <Flex
            align="center"
            wrap="wrap"
            gap="1.5"
            mt="1"
            color="fg.muted"
            fontSize="sm"
            minW="0"
          >
            <Flex align="center" gap="1">
              <MapPin size={13} strokeWidth={1.8} aria-hidden="true" />
              <Text as="span">{roomName}</Text>
            </Flex>
            <Text as="span" color="fg.subtle" aria-hidden="true">
              •
            </Text>
            <Text as="span">
              {itemsCount} {itemsCount === 1 ? "item" : "itens"}
            </Text>
            <Badge
              {...colors}
              borderRadius="full"
              px="2.5"
              py="0.5"
              fontSize="xs"
              fontWeight="medium"
            >
              {category}
            </Badge>
          </Flex>
        </Box>

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
    </Box>
  );
}
