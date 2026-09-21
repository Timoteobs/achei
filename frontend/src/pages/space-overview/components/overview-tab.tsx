import { SimpleGrid, Stack } from "@chakra-ui/react";
import { RecentItemsSection } from "./recent-items-section";
import { RoomsSection } from "./rooms-section";
import { SpaceActivitySection } from "./space-activity-section";

export function OverviewTab() {
  return (
    <Stack gap="6" minW="0">
      <RoomsSection />
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6" minW="0">
        <RecentItemsSection />
        <SpaceActivitySection />
      </SimpleGrid>
    </Stack>
  );
}
