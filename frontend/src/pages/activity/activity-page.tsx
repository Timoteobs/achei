import { Box } from "@chakra-ui/react";
import { CollectionHeader } from "../../components/collection-header/collection-header";
import { ActivityStats } from "./components/stats/activity-stats";
import { ActivityTimeline } from "./components/timeline/activity-timeline";

export function ActivityPage() {
  return (
    <Box
      as="main"
      flex="1"
      minW="0"
      px={{ base: "5", md: "6", lg: "8" }}
      py="5"
    >
      <CollectionHeader
        title="Atividade"
        description="Acompanhe as atividades realizadas nos seus espaços."
        searchLabel="Buscar atividades"
        showFilters={false}
      />
      <ActivityStats />
      <ActivityTimeline />
    </Box>
  );
}
