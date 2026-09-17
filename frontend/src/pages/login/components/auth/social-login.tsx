import { Button, Flex, Separator, Text } from "@chakra-ui/react";
import type { SocialProvider } from "./types";

export function SocialLogin({
  onSelect,
  disabled,
  pending,
}: Readonly<{
  onSelect: (provider: SocialProvider) => void;
  disabled?: boolean;
  pending?: SocialProvider | null;
}>) {
  return (
    <>
      <Flex align="center" gap="4" mt="8" mb="6">
        <Separator flex="1" borderColor="border.default" />
        <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">
          ou continue com
        </Text>
        <Separator flex="1" borderColor="border.default" />
      </Flex>
      <Flex gap="3">
        <Button
          type="button"
          flex="1"
          h="48px"
          variant="outline"
          borderRadius="md"
          borderColor="border.default"
          bg="bg.surface"
          color="fg.default"
          fontSize="sm"
          fontWeight="medium"
          gap="3"
          _hover={{ bg: "bg.canvas", borderColor: "border.emphasized" }}
          disabled={disabled}
          loading={pending === "google"}
          onClick={() => onSelect("google")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.01v2.5h3.23c1.89-1.74 2.99-4.31 2.99-7.34ZM12 22c2.7 0 4.96-.9 6.61-2.43l-3.23-2.5c-.9.6-2.04.96-3.38.96-2.61 0-4.82-1.76-5.61-4.12H3.05v2.58A10 10 0 0 0 12 22ZM6.39 13.91A6 6 0 0 1 6.08 12c0-.66.11-1.3.31-1.91V7.51H3.05A10 10 0 0 0 2 12c0 1.61.38 3.14 1.05 4.49l3.34-2.58ZM12 5.97c1.47 0 2.79.5 3.83 1.5l2.88-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.95 5.51l3.34 2.58A5.99 5.99 0 0 1 12 5.97Z" />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          flex="1"
          h="48px"
          variant="outline"
          borderRadius="md"
          borderColor="border.default"
          bg="bg.surface"
          color="fg.default"
          fontSize="sm"
          fontWeight="medium"
          gap="3"
          _hover={{ bg: "bg.canvas", borderColor: "border.emphasized" }}
          disabled={disabled}
          loading={pending === "apple"}
          onClick={() => onSelect("apple")}
        >
          <svg
            width="18"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.05 12.54c.03 3.23 2.83 4.3 2.86 4.32-.02.08-.45 1.53-1.48 3.03-.9 1.3-1.83 2.6-3.3 2.62-1.44.04-1.9-.85-3.55-.85-1.64 0-2.15.82-3.52.89-1.42.05-2.5-1.41-3.4-2.71-1.85-2.66-3.27-7.52-1.37-10.8a5.3 5.3 0 0 1 4.48-2.71c1.4-.03 2.73.94 3.58.94.86 0 2.47-1.16 4.16-.99.7.03 2.66.28 3.92 2.12-.1.06-2.34 1.36-2.38 4.14ZM14.35 4.5c.75-.91 1.26-2.18 1.12-3.44-1.08.04-2.39.72-3.16 1.63-.7.81-1.32 2.11-1.15 3.35 1.2.1 2.42-.61 3.19-1.54Z" />
          </svg>
          Apple
        </Button>
      </Flex>
    </>
  );
}
