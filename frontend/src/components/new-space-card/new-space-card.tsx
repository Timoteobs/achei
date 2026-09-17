import { Flex, Text } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { Button } from "../button/button";

export function NewSpaceCard() {
  return (
    <Button
      type="button"
      variant="link"
      w="60"
      h="full"
      minH="48"
      flexShrink="0"
      flexDirection="column"
      gap="3"
      p="4"
      bg="bg.canvas"
      borderWidth="1px"
      borderStyle="dashed"
      borderColor="border.default"
      borderRadius="md"
      _hover={{ bg: "bg.subtle", borderColor: "border.emphasized" }}
    >
      <Flex
        as="span"
        boxSize="12"
        align="center"
        justify="center"
        borderRadius="full"
        bg="brand.subtle"
        color="brand.fg"
      >
        <Plus size={24} strokeWidth={1.8} aria-hidden="true" />
      </Flex>
      <Text as="span" fontSize="sm" color="brand.fg">
        Novo espaço
      </Text>
    </Button>
  );
}
