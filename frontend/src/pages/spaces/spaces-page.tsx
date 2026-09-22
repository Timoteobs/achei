import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { CollectionHeader } from "../../components/collection-header/collection-header";
import { SpacesSection } from "../home/components/spaces-section";
import { spacesMock } from "../home/spaces-mock";
import { NewSpaceModal } from "./components/new-space-modal";

export function SpacesPage() {
  const [isNewSpaceOpen, setIsNewSpaceOpen] = useState(false);

  return (
    <Box
      as="main"
      flex="1"
      minW="0"
      px={{ base: "5", md: "6", lg: "8" }}
      py="5"
    >
      <CollectionHeader
        title="Meus espaços"
        description="Organize e acesse todos os seus espaços em um só lugar."
        actionLabel="Novo espaço"
        searchLabel="Buscar espaços"
        onActionClick={() => setIsNewSpaceOpen(true)}
      />
      <SpacesSection
        spaces={spacesMock}
        showTitle={false}
        onNewSpaceClick={() => setIsNewSpaceOpen(true)}
      />
      <NewSpaceModal open={isNewSpaceOpen} onOpenChange={setIsNewSpaceOpen} />
    </Box>
  );
}
