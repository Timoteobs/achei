import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useId, useState } from "react";
import { NewSpaceCard } from "../../../../components/new-space-card/new-space-card";
import { SpaceCard } from "../../../../components/space-card/space-card";
import { Button } from "../../../../components/button/button";
import { useSpacesQuery } from "../../../../hooks/spaces/use-spaces-query";
import type { SpaceResponse } from "../../../../services/spaces";
import { DeleteSpaceModal } from "../../../spaces/components/delete-space/delete-space-modal";
import { NewSpaceModal } from "../../../spaces/components/new-space/new-space-modal";

export function SpacesSection({
  showTitle = true,
  onNewSpaceClick,
}: Readonly<{
  showTitle?: boolean;
  onNewSpaceClick?: () => void;
}>) {
  const headingId = useId();
  const [spaceToDelete, setSpaceToDelete] = useState<SpaceResponse | null>(null);
  const [spaceToEdit, setSpaceToEdit] = useState<SpaceResponse | null>(null);
  const spacesQuery = useSpacesQuery();
  const spaces = spacesQuery.data ?? [];

  return (
    <Box
      as="section"
      aria-labelledby={showTitle ? headingId : undefined}
      mt="8"
      minW="0"
      aria-busy={spacesQuery.isFetching}
    >
      {showTitle && (
        <Heading
          as="h2"
          id={headingId}
          color="fg.default"
          fontSize="lg"
          fontWeight="semibold"
          mb="4"
        >
          Meus espaços
        </Heading>
      )}
      {spacesQuery.isPending && (
        <Flex role="status" align="center" gap="3" py="6" color="fg.muted">
          <Spinner size="sm" color="brand.fg" />
          <Text fontSize="sm">Carregando espaços...</Text>
        </Flex>
      )}
      {spacesQuery.isError && (
        <Flex align="center" gap="3" flexWrap="wrap" mb="4">
          <Text color="fg.muted" fontSize="sm">
            Não foi possível carregar seus espaços.
          </Text>
          <Button
            type="button"
            variant="outline"
            h="10"
            px="4"
            loading={spacesQuery.isFetching}
            onClick={() => {
              void spacesQuery.refetch();
            }}
          >
            Tentar novamente
          </Button>
        </Flex>
      )}
      {spacesQuery.isSuccess && spaces.length === 0 && (
        <Text color="fg.muted" fontSize="sm" mb="4">
          Você ainda não tem espaços cadastrados.
        </Text>
      )}
      <Flex
        as="ul"
        aria-label="Lista de espaços"
        tabIndex={0}
        gap="5"
        flexWrap={"wrap"}
        scrollbarWidth="thin"
        listStyleType="none"
        m="0"
        p="1"
        pb="3"
        borderRadius="md"
      >
        <Box as="li" flexShrink="0">
          <NewSpaceCard onClick={onNewSpaceClick} />
        </Box>
        {spaces.map((space) => (
          <Box as="li" key={space.id} flexShrink="0">
            <SpaceCard
              id={String(space.id)}
              name={space.name}
              description={space.description}
              imageUrl={space.imageUrl}
              onDelete={() => setSpaceToDelete(space)}
              onEdit={() => setSpaceToEdit(space)}
            />
          </Box>
        ))}
      </Flex>
      <DeleteSpaceModal space={spaceToDelete} onClose={() => setSpaceToDelete(null)} />
      {spaceToEdit && (
        <NewSpaceModal
          key={spaceToEdit.id}
          open
          space={spaceToEdit}
          onOpenChange={(open) => {
            if (!open) setSpaceToEdit(null);
          }}
        />
      )}
    </Box>
  );
}
