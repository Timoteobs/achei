import { Flex, Text } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { Button } from "../button/button";

export function AddCard({
  label,
  size = "md",
}: Readonly<{ label: string; size?: "sm" | "md" }>) {
  return (
    <Button
      type="button"
      variant="link"
      w={size === "sm" ? "36" : "60"}
      h="full"
      minH={size === "sm" ? "32" : "48"}
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
        boxSize={size === "sm" ? "10" : "12"}
        align="center"
        justify="center"
        borderRadius="full"
        bg="brand.subtle"
        color="brand.fg"
      >
        <Plus size={24} strokeWidth={1.8} aria-hidden="true" />
      </Flex>
      <Text as="span" fontSize="sm" color="brand.fg">
        {label}
      </Text>
    </Button>
  );
}
