import { Box, Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useState } from "react";
import { AddCard } from "../../../../components/add-card/add-card";
import { BoxCard } from "../../../../components/box-card/box-card";
import { Button } from "../../../../components/button/button";
import { EmptyState } from "../../../../components/empty-state/empty-state";
import { useBoxesQuery } from "../../../../hooks/boxes/use-boxes-query";
import type { BoxResponse } from "../../../../services/boxes";
import { DeleteBoxModal } from "./delete-box/delete-box-modal";

export function BoxesGrid({ roomId, onNewBoxClick }: Readonly<{ roomId: number; onNewBoxClick: () => void }>) {
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const boxesQuery = useBoxesQuery(spaceId);
  const [boxToDelete, setBoxToDelete] = useState<BoxResponse | null>(null);
  const boxes = boxesQuery.data?.filter((box) => box.roomId === roomId) ?? [];
  const notFound = isAxiosError(boxesQuery.error) && boxesQuery.error.response?.status === 404;

  return (
    <Box aria-busy={boxesQuery.isFetching}>
      {boxesQuery.isPending && (
        <Flex role="status" align="center" gap="3" py="4" color="fg.muted">
          <Spinner size="sm" color="brand.fg" />
          <Text fontSize="sm">Carregando caixas...</Text>
        </Flex>
      )}
      {boxesQuery.isError && (
        <Flex align="center" gap="3" wrap="wrap" py="4">
          <Text role="alert" color="fg.muted" fontSize="sm">
            {notFound ? "Espaço não encontrado ou sem permissão de acesso." : "Não foi possível carregar as caixas."}
          </Text>
          <Button type="button" variant="outline" h="10" px="4" loading={boxesQuery.isFetching} onClick={() => { void boxesQuery.refetch(); }}>Tentar novamente</Button>
        </Flex>
      )}
      {boxesQuery.isSuccess && boxes.length === 0 && (
        <EmptyState action={{ label: "Nova caixa", onClick: onNewBoxClick }} />
      )}
      {boxes.length > 0 && (
        <SimpleGrid
          as="ul"
          aria-label="Lista de caixas"
          columns={{ base: 1, md: 2, xl: 3 }}
          gap="5"
          listStyleType="none"
          m="0"
          p="0"
        >
          {boxes.map((box) => (
            <Box as="li" key={box.id} minW="0">
              <BoxCard
                name={box.name}
                roomName={box.roomName}
                itemsCount={box.itemsCount}
                onDelete={() => setBoxToDelete(box)}
              />
            </Box>
          ))}
          <Box as="li" minW="0">
            <AddCard label="Nova caixa" size="lg" onClick={onNewBoxClick} />
          </Box>
        </SimpleGrid>
      )}
      <DeleteBoxModal spaceId={spaceId} box={boxToDelete} onClose={() => setBoxToDelete(null)} />
    </Box>
  );
}
