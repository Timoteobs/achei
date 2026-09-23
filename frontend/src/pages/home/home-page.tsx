import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { NewSpaceModal } from "../spaces/components/new-space/new-space-modal";
import { HomeHeader } from "./components/home-header";
import { SpacesSection } from "./components/spaces/spaces-section";
import { spacesMock } from "./components/spaces/spaces-mock";
import { QuickAccessSection } from "./components/quick-access/quick-access-section";
import { RecentActivitySection } from "./components/recent-activity/recent-activity-section";

export function HomePage() {
  const [isNewSpaceOpen, setIsNewSpaceOpen] = useState(false);

  return (
    <Box
      as="main"
      flex="1"
      minW="0"
      bg="bg.canvas"
      px={{ base: "5", md: "6", lg: "8" }}
      py={{ base: "6", lg: "8" }}
    >
      <HomeHeader onNewSpaceClick={() => setIsNewSpaceOpen(true)} />
      <SpacesSection
        spaces={spacesMock}
        onNewSpaceClick={() => setIsNewSpaceOpen(true)}
      />
      <QuickAccessSection />
      <RecentActivitySection />
      <NewSpaceModal open={isNewSpaceOpen} onOpenChange={setIsNewSpaceOpen} />
    </Box>
  );
}
