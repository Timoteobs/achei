import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { Button } from "../button/button";
import { EmptyStateIllustration } from "./empty-state-illustration";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = "Nada por aqui ainda",
  description = "Quando houver conteúdo, ele será exibido aqui.",
  action,
}: Readonly<EmptyStateProps>) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="full"
      minW="0"
      px={{ base: "4", md: "8" }}
      py={{ base: "10", md: "12" }}
      textAlign="center"
      gap="6"
    >
      <EmptyStateIllustration />
      <Box role="status" maxW="lg">
        <Heading
          as="h3"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          color="fg.default"
          lineHeight="short"
          overflowWrap="anywhere"
        >
          {title}
        </Heading>
        <Text mt="3" fontSize={{ base: "sm", md: "md" }} color="fg.muted" lineHeight="tall">
          {description}
        </Text>
      </Box>
      {action && (
        <Button type="button" w={{ base: "full", sm: "auto" }} maxW="xs" px="6" onClick={action.onClick}>
          <Plus size={18} strokeWidth={1.8} aria-hidden="true" />
          {action.label}
        </Button>
      )}
    </Flex>
  );
}
