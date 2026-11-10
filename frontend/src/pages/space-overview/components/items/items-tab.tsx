import { Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/button/button";
import { EmptyState } from "../../../../components/empty-state/empty-state";
import { useItemsQuery } from "../../../../hooks/items/use-items-query";
import type { BoxResponse } from "../../../../services/boxes";
import type { ItemResponse, ItemSort } from "../../../../services/items";
import { SelectedBoxContext } from "./selected-box-context";
import { ItemsHeader } from "./items-header";
import { ItemsTable } from "./items-table";
import { DeleteItemModal } from "./delete-item/delete-item-modal";
import { MoveItemModal } from "./move-item/move-item-modal";
import { NewItemModal } from "./new-item-modal";

export function ItemsTab({ box, spaceName }: Readonly<{ box: BoxResponse; spaceName: string }>) {
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemResponse | null>(null);
  const [itemToEdit, setItemToEdit] = useState<ItemResponse | null>(null);
  const [itemToMove, setItemToMove] = useState<ItemResponse | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{ page: number; sort: ItemSort; search: string }>({
    page: 1, sort: "recent", search: "",
  });
  const query = useItemsQuery(spaceId, { ...filters, locationId: box.id, pageSize: 20 });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilters((previous) => previous.search === search.trim()
        ? previous
        : { ...previous, search: search.trim(), page: 1 });
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!query.data) return;
    const lastPage = Math.max(1, query.data.totalPages);
    if (filters.page > lastPage) setFilters((previous) => ({ ...previous, page: lastPage }));
  }, [query.data, filters.page]);

  return (
    <Stack gap="6" minW="0">
      <SelectedBoxContext box={box} />
      <ItemsHeader
        onNewItemClick={() => setIsNewItemModalOpen(true)}
        search={search}
        sort={filters.sort}
        onSearchChange={setSearch}
        onSortChange={(sort) => setFilters((previous) => ({ ...previous, sort, page: 1 }))}
      />
      <Box aria-busy={query.isFetching}>
        {query.isPending ? (
          <Flex role="status" align="center" gap="3" py="4" color="fg.muted">
            <Spinner size="sm" color="brand.fg" />
            <Text fontSize="sm">Carregando itens...</Text>
          </Flex>
        ) : query.isError ? (
          <Flex align="center" gap="3" wrap="wrap" py="4">
            <Text role="alert" color="fg.muted" fontSize="sm">Não foi possível carregar os itens desta caixa.</Text>
            <Button type="button" variant="outline" h="10" px="4" loading={query.isFetching} onClick={() => { void query.refetch(); }}>Tentar novamente</Button>
          </Flex>
        ) : query.data.items.length > 0 ? (
          <ItemsTable onMove={setItemToMove} onEdit={setItemToEdit} onDelete={setItemToDelete} data={query.data} onPageChange={(page) => setFilters((previous) => ({ ...previous, page }))} />
        ) : (
          <EmptyState
            title={filters.search ? "Nenhum item encontrado" : undefined}
            description={filters.search ? "Tente buscar por outro nome." : "Adicione o primeiro item desta caixa."}
            action={filters.search ? undefined : { label: "Novo item", onClick: () => setIsNewItemModalOpen(true) }}
          />
        )}
      </Box>
      <DeleteItemModal spaceId={spaceId} item={itemToDelete} onClose={() => setItemToDelete(null)} />
      {itemToMove && (
        <MoveItemModal
          key={itemToMove.id}
          spaceId={spaceId}
          item={itemToMove}
          initialRoomId={box.roomId}
          onClose={() => setItemToMove(null)}
        />
      )}
      {itemToEdit && (
        <NewItemModal
          key={itemToEdit.id}
          open
          item={itemToEdit}
          location={{ space: spaceName, room: box.roomName, roomId: box.roomId, box: box.name, boxId: box.id }}
          onOpenChange={(open) => {
            if (!open) setItemToEdit(null);
          }}
        />
      )}
      {isNewItemModalOpen && (
        <NewItemModal
          open
          location={{ space: spaceName, room: box.roomName, roomId: box.roomId, box: box.name, boxId: box.id }}
          onOpenChange={setIsNewItemModalOpen}
        />
      )}
    </Stack>
  );
}