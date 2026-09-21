import { Box, Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface InfoCardProps {
  icon: ReactNode;
  label?: string;
  value: ReactNode;
}

export function InfoCard({ icon, label, value }: Readonly<InfoCardProps>) {
  return (
    <Flex
      as="article"
      align="center"
      gap="2"
      minW="0"
      minH="14"
      px="3"
      py="2"
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="md"
    >
      <Flex
        boxSize="8"
        flexShrink="0"
        align="center"
        justify="center"
        borderRadius="full"
        bg="brand.subtle"
        color="brand.fg"
        aria-hidden="true"
      >
        {icon}
      </Flex>
      <Box
        minW="0"
        color="fg.default"
        fontSize="sm"
        fontWeight="semibold"
        overflowWrap="anywhere"
      >
        {label && (
          <Text color="fg.muted" fontSize="xs" fontWeight="regular">
            {label}
          </Text>
        )}
        {value}
      </Box>
    </Flex>
  );
}
