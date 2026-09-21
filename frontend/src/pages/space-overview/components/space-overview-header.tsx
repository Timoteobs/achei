import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { ChevronDown, House, Plus, UserRoundPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "../../../components/button/button";

export function SpaceOverviewHeader({
  name,
  icon: Icon = House,
}: Readonly<{ name: string; icon?: LucideIcon }>) {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      flexWrap="wrap"
      gap="6"
    >
      <Flex align="center" gap="4" flex="1 1 320px" minW="0">
        <Flex
          w="16"
          h="14"
          flexShrink="0"
          align="center"
          justify="center"
          bg="brand.subtle"
          color="brand.fg"
          borderRadius="sm"
          aria-hidden="true"
        >
          <Icon size={30} strokeWidth={1.8} />
        </Flex>
        <Box minW="0">
          <Heading
            as="h1"
            fontSize="xl"
            fontWeight="bold"
            color="fg.default"
            lineHeight="short"
            overflowWrap="anywhere"
          >
            {name}
          </Heading>
          <Text color="fg.muted" fontSize="sm" mt="1">
            Aqui estão todos os itens, ambientes e caixas deste espaço.
          </Text>
        </Box>
      </Flex>
      <Flex gap="3" flex={{ base: "1 1 100%", md: "0 0 auto" }} flexWrap="wrap">
        <Button
          type="button"
          variant="link"
          h="10"
          px="4"
          gap="2"
          flex={{ base: "1 1 auto", md: "0 0 auto" }}
          fontSize="sm"
          bg="bg.surface"
          borderWidth="1px"
          borderColor="border.default"
          borderRadius="sm"
          boxShadow="xs"
          _hover={{ bg: "bg.subtle", borderColor: "border.emphasized" }}
        >
          <UserRoundPlus size={16} strokeWidth={1.8} aria-hidden="true" />
          Convidar membros
        </Button>
        <Button
          type="button"
          w="auto"
          h="10"
          px="4"
          flex={{ base: "1 1 auto", md: "0 0 auto" }}
          borderRadius="sm"
          fontWeight="medium"
        >
          <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
          Novo item
          <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
        </Button>
      </Flex>
    </Flex>
  );
}
