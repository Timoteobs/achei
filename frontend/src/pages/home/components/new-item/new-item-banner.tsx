import { Box, Flex, Heading, Text, chakra } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { Button } from "../../../../components/button/button";
import { StorageBoxesIllustration } from "./storage-boxes-illustration";

export function NewItemBanner({
  onNewItemClick,
}: Readonly<{ onNewItemClick?: () => void }>) {
  return (
    <Flex
      mt={{ base: "6", md: "7" }}
      minH="112px"
      direction={{ base: "column", md: "row" }}
      align="center"
      gap={{ base: "4", md: "6", xl: "8" }}
      px={{ base: "5", md: "6", xl: "9" }}
      py={{ base: "5", md: "3" }}
      bgGradient="to-r"
      gradientFrom="bg.surface"
      gradientVia="brand.subtle"
      gradientTo="brand.muted"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="md"
      position="relative"
      overflow="hidden"
      isolation="isolate"
    >
      <chakra.svg
        viewBox="0 0 440 120"
        preserveAspectRatio="none"
        position="absolute"
        right="0"
        bottom="0"
        h="full"
        w={{ base: "full", md: "40%" }}
        zIndex="-1"
        aria-hidden="true"
        focusable="false"
      >
        <chakra.path
          d="M0 120C30 84 66 107 79 66C95 14 146 1 180 23C210 43 209 87 258 81C309 73 305 39 355 37C390 36 409 51 440 32V120Z"
          fill="brand.emphasized"
          opacity="0.28"
        />
        <chakra.circle
          cx="36"
          cy="94"
          r="3"
          fill="brand.emphasized"
          opacity="0.5"
        />
      </chakra.svg>
      <StorageBoxesIllustration />
      <Box flex="1" minW="0" textAlign={{ base: "center", md: "start" }}>
        <Heading
          as="h2"
          color="fg.default"
          fontSize={{ base: "xl", xl: "22px" }}
          fontWeight="bold"
          letterSpacing="tight"
          lineHeight="short"
        >
          Adicionar um novo item
        </Heading>
        <Text color="fg.muted" fontSize="sm" mt="2" lineHeight="1.5">
          Cadastre um item, defina onde ele está guardado e mantenha tudo
          organizado.
        </Text>
      </Box>
      <Box
        flexShrink="0"
        w={{ base: "full", md: "190px", xl: "220px" }}
        maxW={{ base: "320px", md: "none" }}
        position="relative"
      >
        <Box
          position="absolute"
          inset="-1"
          top="5"
          bottom="-1"
          bg="brand.200"
          borderRadius="full"
          opacity="0.65"
          aria-hidden="true"
        />
        <Button
          type="button"
          onClick={onNewItemClick}
          disabled={!onNewItemClick}
          position="relative"
          h="52px"
          w="full"
          px="6"
          gap="3"
          borderRadius="full"
          fontSize={{ base: "lg", xl: "xl" }}
          fontWeight="semibold"
          gradientFrom="brand.700"
          gradientTo="brand.600"
          boxShadow="sm"
          _hover={{
            gradientFrom: "brand.800",
            gradientTo: "brand.700",
          }}
        >
          <Plus size={24} strokeWidth={1.8} aria-hidden="true" />
          Novo item
        </Button>
      </Box>
    </Flex>
  );
}
