import { Box, Flex, Heading, Text, useTabsContext } from "@chakra-ui/react";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { Button } from "../../../../components/button/button";
import type { BoxResponse } from "../../../../services/boxes";

export function SelectedBoxContext({ box }: Readonly<{ box: BoxResponse }>) {
  const tabs = useTabsContext();
  return (
    <Flex align="center" gap={{ base: "3", sm: "5" }} wrap="wrap" minW="0">
      <Button type="button" variant="link" color="fg.muted" gap="2" flexShrink="0" fontSize="sm" fontWeight="normal"
        onClick={() => tabs.setValue("boxes")}
        _hover={{ color: "fg.default", textDecoration: "underline" }}>
        <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
        Voltar para Caixas
      </Button>
      <Box display={{ base: "none", sm: "block" }} h="4" borderLeftWidth="1px" borderColor="border.emphasized" aria-hidden="true" />
      <Flex as="section" aria-label="Caixa selecionada" align="center" gap="2" minW="0" maxW="full" minH="10" ps="1" pe="3" py="1"
        bg="bg.canvas" borderWidth="1px" borderColor="border.default" borderRadius="md">
        <Flex bg="brand.subtle" color="brand.fg" boxSize="8" flexShrink="0" align="center" justify="center" borderRadius="sm" aria-hidden="true">
          <Package size={18} strokeWidth={1.8} />
        </Flex>
        <Heading as="h2" fontSize="sm" fontWeight="semibold" color="fg.default" minW="0" truncate title={box.name}>{box.name}</Heading>
        <Text as="span" color="fg.muted" mx="1" aria-hidden="true">•</Text>
        <Flex align="center" gap="2" color="fg.muted" fontSize="sm" minW="0">
          <Box flexShrink="0" aria-hidden="true"><MapPin size={16} strokeWidth={1.8} /></Box>
          <Text as="span" truncate title={box.roomName}>{box.roomName}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
