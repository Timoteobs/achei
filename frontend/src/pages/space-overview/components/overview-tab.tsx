import { Stack } from "@chakra-ui/react";
import { RecentItemsSection } from "./recent-items-section";
import { RoomsSection } from "./rooms-section";

export function OverviewTab() {
  return (
    <Stack gap="6" minW="0">
      <RoomsSection />
      <RecentItemsSection />
    </Stack>
  );
}
