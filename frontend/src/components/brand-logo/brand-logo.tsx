import { Box, Flex, Text } from "@chakra-ui/react";

export function BrandMark({
  inverted = false,
}: Readonly<{ inverted?: boolean }>) {
  return (
    <Box
      color={inverted ? "brand.contrast" : "brand.solid"}
      flexShrink={0}
      aria-hidden="true"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 14 15 4l11 10M7 12v13a2 2 0 0 0 2 2h7M23 12v3" />
        <circle cx="21" cy="22" r="5.5" />
        <path d="m25 26 4 4" />
      </svg>
    </Box>
  );
}

export function BrandLogo({
  inverted = false,
}: Readonly<{ inverted?: boolean }>) {
  return (
    <Flex align="center" gap="2.5" aria-label="Achei!">
      <BrandMark inverted={inverted} />
      <Text
        fontSize="26px"
        fontWeight="bold"
        letterSpacing="-1.2px"
        color={inverted ? "brand.contrast" : "brand.fg"}
      >
        Achei!
      </Text>
    </Flex>
  );
}
