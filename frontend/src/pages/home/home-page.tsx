import { Box } from "@chakra-ui/react";
import { HomeHeader } from "./components/home-header";
import { SpacesSection } from "./components/spaces-section";
import { spacesMock } from "./spaces-mock";
import { QuickAccessSection } from "./components/quick-access-section";
import { RecentActivitySection } from "./components/recent-activity-section";

export function HomePage() {
  return (
    <Box
      as="main"
      flex="1"
      minW="0"
      bg="bg.canvas"
      px={{ base: "5", md: "6", lg: "8" }}
      py={{ base: "6", lg: "8" }}
    >
      <HomeHeader />
      <SpacesSection spaces={spacesMock} />
      <QuickAccessSection />
      <RecentActivitySection />
    </Box>
  );
}
