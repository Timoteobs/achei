import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Button } from "../../components/button/button";
import { CollectionHeader } from "../../components/collection-header/collection-header";
import { SpaceSelect } from "../../components/space-select/space-select";
import { useSpacesQuery } from "../../hooks/spaces/use-spaces-query";
import { useAuthStore } from "../../stores/auth-store";
import { NewSpaceModal } from "../spaces/components/new-space/new-space-modal";
import { ActivityStats } from "./components/stats/activity-stats";
import { ActivityTimeline } from "./components/timeline/activity-timeline";

export function ActivityPage() {
  const spacesQuery = useSpacesQuery();
  const userId = useAuthStore((state) => state.session?.user.id);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number>();
  const [isNewSpaceOpen, setIsNewSpaceOpen] = useState(false);
  const selectedSpace = spacesQuery.data?.find((space) => space.id === selectedSpaceId)
    ?? spacesQuery.data?.[0];

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
      <Box mt="4" w="full" maxW="340px">
        <SpaceSelect
          spaces={(spacesQuery.data ?? []).map((space) => ({
            id: space.id,
            name: space.name,
            description: space.ownerUserId === userId ? "Espaço pessoal" : "Espaço compartilhado",
          }))}
          value={selectedSpace?.id}
          onValueChange={setSelectedSpaceId}
          onCreateSpace={() => {
            if (selectedSpace) setSelectedSpaceId(selectedSpace.id);
            setIsNewSpaceOpen(true);
          }}
          loading={spacesQuery.isPending}
          disabled={spacesQuery.isError}
        />
      </Box>
      {spacesQuery.isError && (
        <Flex align="center" gap="3" wrap="wrap" mt="4">
          <Text role="alert" color="fg.muted" fontSize="sm">Não foi possível carregar seus espaços.</Text>
          <Button type="button" variant="outline" h="10" px="4" loading={spacesQuery.isFetching} onClick={() => { void spacesQuery.refetch(); }}>Tentar novamente</Button>
        </Flex>
      )}
      <ActivityStats />
      {spacesQuery.isSuccess && <ActivityTimeline space={selectedSpace} />}
      {isNewSpaceOpen && <NewSpaceModal open onOpenChange={setIsNewSpaceOpen} />}
    </Box>
  );
}
