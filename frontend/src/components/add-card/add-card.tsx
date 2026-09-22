import { Flex, Text } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { Button } from "../button/button";

const sizeStyles = {
  sm: { w: "36", minH: "32", iconBox: "10" },
  md: { w: "60", minH: "48", iconBox: "12" },
  lg: { w: "full", minH: "28", iconBox: "12" },
} satisfies Record<string, { w: string; minH: string; iconBox: string }>;

export function AddCard({
  label,
  size = "md",
  onClick,
}: Readonly<{
  label: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}>) {
  const { w, minH, iconBox } = sizeStyles[size];

  return (
    <Button
      type="button"
      onClick={onClick}
      variant="link"
      w={w}
      h="full"
      minH={minH}
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
        boxSize={iconBox}
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
