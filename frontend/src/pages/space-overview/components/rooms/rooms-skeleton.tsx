import { Box, Flex, Skeleton, Stack, VisuallyHidden } from "@chakra-ui/react";
import type { RoomCardProps } from "../../../../components/room-card/room-card";

export function RoomsSkeleton({ layout = "detailed" }: Readonly<Pick<RoomCardProps, "layout">>) {
  const compact = layout === "compact";

  return (
    <Box role="status" minW="0">
      <VisuallyHidden>Carregando ambientes...</VisuallyHidden>
      <Box
        aria-hidden="true"
        display={compact ? "flex" : "grid"}
        gridTemplateColumns={compact ? undefined : { base: "minmax(0, 1fr)", sm: "repeat(auto-fill, minmax(220px, 1fr))" }}
        gap={compact ? "4" : "5"}
        overflowX={compact ? "hidden" : undefined}
        p={compact ? "1" : "0"}
      >
        {Array.from({ length: compact ? 6 : 4 }, (_, index) => (
          <Flex
            key={index}
            direction="column"
            w={compact ? "36" : "full"}
            minH={compact ? "32" : "220px"}
            minW="0"
            flexShrink="0"
            align={compact ? "center" : "stretch"}
            justify={compact ? "center" : undefined}
            p={compact ? "3" : "0"}
            pt={compact ? "8" : "0"}
            bg={compact ? "bg.subtle" : "bg.surface"}
            borderWidth={compact ? "0" : "1px"}
            borderColor="border.default"
            borderRadius="md"
            overflow="hidden"
          >
            <Skeleton w={compact ? "7" : "full"} h={compact ? "7" : "120px"} flexShrink="0" borderRadius={compact ? "sm" : "0"} />
            <Stack gap={compact ? "1" : "3"} w="full" p={compact ? "0" : "4"} mt={compact ? "3" : "0"} align={compact ? "center" : "start"}>
              <Skeleton h="4" w="70%" borderRadius="sm" />
              <Skeleton h="4" w="45%" borderRadius="sm" />
            </Stack>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}
