import { Box, Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { colorVariantStyles } from "../color-variants";
import type { ColorVariant } from "../color-variants";

export interface InfoCardProps {
  icon: ReactNode;
  label?: string;
  value: ReactNode;
  description?: ReactNode;
  layout?: "compact" | "stat";
  variant?: ColorVariant;
}

export function InfoCard({
  icon,
  label,
  value,
  description,
  layout = "compact",
  variant = "teal",
}: Readonly<InfoCardProps>) {
  const isStat = layout === "stat";

  return (
    <Flex
      as="article"
      align="center"
      gap={isStat ? "3" : "2"}
      minW="0"
      w={isStat ? "full" : undefined}
      h={isStat ? "full" : undefined}
      minH={isStat ? "24" : "14"}
      px={isStat ? "4" : "3"}
      py={isStat ? "3" : "2"}
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="md"
    >
      <Flex
        boxSize={isStat ? "14" : "8"}
        flexShrink="0"
        align="center"
        justify="center"
        borderRadius={isStat ? "md" : "full"}
        {...colorVariantStyles[variant]}
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
        {!isStat && label && (
          <Text color="fg.muted" fontSize="xs" fontWeight="regular">
            {label}
          </Text>
        )}
        {isStat ? (
          <>
            <Text fontSize="2xl" fontWeight="bold" lineHeight="short">
              {value}
            </Text>
            {label && (
              <Text fontSize="sm" fontWeight="medium" mt="0.5">
                {label}
              </Text>
            )}
          </>
        ) : (
          value
        )}
        {description && (
          <Text color="fg.muted" fontSize="xs" fontWeight="regular" mt="1">
            {description}
          </Text>
        )}
      </Box>
    </Flex>
  );
}
