import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { NewSpaceModal } from "../spaces/components/new-space/new-space-modal";
import { HomeHeader } from "./components/home-header";
import { NewItemModal } from "../space-overview/components/items/new-item-modal";
import { SpacesSection } from "./components/spaces/spaces-section";

export function HomePage() {
  const [isNewSpaceOpen, setIsNewSpaceOpen] = useState(false);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);

  return (
    <Box
      as="main"
      flex="1"
      minW="0"
      bg="bg.canvas"
      px={{ base: "5", md: "6", lg: "8" }}
      py={{ base: "5", lg: "6" }}
    >
      <HomeHeader onNewItemClick={() => setIsNewItemOpen(true)} />
      <SpacesSection onNewSpaceClick={() => setIsNewSpaceOpen(true)} />
      <NewSpaceModal open={isNewSpaceOpen} onOpenChange={setIsNewSpaceOpen} />
      {isNewItemOpen && <NewItemModal open onOpenChange={setIsNewItemOpen} />}
    </Box>
  );
}
