import { Box, Flex, Heading, Text, useTabsContext } from "@chakra-ui/react";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { Button } from "../../../../components/button/button";
import { colorVariantStyles } from "../../../../components/color-variants";
import type { BoxResponse } from "../../../../services/boxes";

export function SelectedBoxContext({ box }: Readonly<{ box: BoxResponse }>) {
  const tabs = useTabsContext();
  return (
    <Box minW="0">
      <Button type="button" variant="link" color="fg.muted" gap="2" mb="3"
        onClick={() => tabs.setValue("boxes")}
        _hover={{ color: "fg.default", textDecoration: "underline" }}>
        <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
        Voltar para Caixas
      </Button>
      <Flex as="section" align="center" gap="4" w="full" minH="20" p="4"
        bg="bg.surface" borderWidth="1px" borderColor="border.default" borderRadius="md">
        <Flex {...colorVariantStyles.blue} boxSize="14" flexShrink="0" align="center" justify="center" borderRadius="md" aria-hidden="true">
          <Package size={26} strokeWidth={1.8} />
        </Flex>
        <Box flex="1" minW="0">
          <Heading as="h2" fontSize="sm" fontWeight="semibold" color="fg.default" truncate>{box.name}</Heading>
          <Flex align="center" wrap="wrap" gap="1.5" mt="1" color="fg.muted" fontSize="sm" minW="0">
            <Flex align="center" gap="1">
              <MapPin size={13} strokeWidth={1.8} aria-hidden="true" />
              <Text as="span">{box.roomName}</Text>
            </Flex>
            <Text as="span" color="fg.subtle" aria-hidden="true">•</Text>
            <Text as="span">{box.itemsCount} {box.itemsCount === 1 ? "item" : "itens"}</Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}