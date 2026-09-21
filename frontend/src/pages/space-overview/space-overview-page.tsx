import { Box } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { spacesMock } from "../home/spaces-mock";
import { SpaceOverviewHeader } from "./components/space-overview-header";
import { SpaceSummary } from "./components/space-summary";

export function SpaceOverviewPage() {
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const space = spacesMock.find(({ id }) => id === spaceId);

  return (
    <Box
      as="main"
      flex="1"
      minW="0"
      px={{ base: "5", md: "6", lg: "8" }}
      py="5"
    >
      <SpaceOverviewHeader name={space?.name ?? "Espaço"} icon={space?.icon} />
      <SpaceSummary />
    </Box>
  );
}
