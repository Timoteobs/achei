import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { isAxiosError } from "axios";
import { Button } from "../../components/button/button";
import { useSpaceQuery } from "../../hooks/spaces/use-space-query";
import { SpaceOverviewHeader } from "./components/space-overview-header";
import { SpaceSummary } from "./components/summary/space-summary";
import { SpaceTabs } from "./components/space-tabs";
import { DeleteSpaceModal } from "../spaces/components/delete-space/delete-space-modal";
import type { SpaceResponse } from "../../services/spaces";

export function SpaceOverviewPage() {
  const navigate = useNavigate();
  const [spaceToDelete, setSpaceToDelete] = useState<SpaceResponse | null>(null);
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const spaceQuery = useSpaceQuery(spaceId);
  const space = spaceQuery.data;
  const notFound = isAxiosError(spaceQuery.error) && spaceQuery.error.response?.status === 404;

  return (
    <Box
      as="main"
      flex="1"
      minW="0"
      px={{ base: "5", md: "6", lg: "8" }}
      py="5"
    >
      {spaceQuery.isPending ? (
        <Flex role="status" align="center" gap="3" py="6" color="fg.muted">
          <Spinner size="sm" color="brand.fg" />
          <Text>Carregando espaço...</Text>
        </Flex>
      ) : spaceQuery.isError || !space ? (
        <Box py="6">
          <Text color="fg.muted" mb="4">
            {notFound
              ? "Espaço não encontrado ou sem permissão de acesso."
              : "Não foi possível carregar este espaço."}
          </Text>
          <Flex gap="3" flexWrap="wrap">
            <Button variant="outline" px="4" asChild>
              <Link to="/espacos">Voltar para meus espaços</Link>
            </Button>
            {!notFound && (
              <Button
                type="button"
                w="auto"
                px="4"
                loading={spaceQuery.isFetching}
                onClick={() => {
                  void spaceQuery.refetch();
                }}
              >
                Tentar novamente
              </Button>
            )}
          </Flex>
        </Box>
      ) : (
        <>
          <SpaceOverviewHeader
            name={space.name}
            description={space.description}
            imageUrl={space.imageUrl}
            onDelete={() => setSpaceToDelete(space)}
          />
          <SpaceSummary createdAt={space.createdAt} />
          <SpaceTabs key={space.id} />
        </>
      )}
      <DeleteSpaceModal
        space={spaceToDelete}
        onClose={() => setSpaceToDelete(null)}
        onDeleted={() => navigate({ to: "/espacos", replace: true })}
      />
    </Box>
  );
}
