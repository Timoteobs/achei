import { Flex, Spinner, Text } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { Button } from "../../../../components/button/button";
import { EmptyState } from "../../../../components/empty-state/empty-state";
import type { useRoomsQuery } from "../../../../hooks/rooms/use-rooms-query";

export function RoomsQueryFeedback({ query, onNewRoomClick }: Readonly<{
  query: ReturnType<typeof useRoomsQuery>;
  onNewRoomClick: () => void;
}>) {
  if (query.isPending) {
    return (
      <Flex role="status" align="center" gap="3" py="4" color="fg.muted">
        <Spinner size="sm" color="brand.fg" />
        <Text fontSize="sm">Carregando ambientes...</Text>
      </Flex>
    );
  }

  if (query.isError) {
    const notFound = isAxiosError(query.error) && query.error.response?.status === 404;
    return (
      <Flex align="center" gap="3" flexWrap="wrap" py="4">
        <Text role="alert" color="fg.muted" fontSize="sm">
          {notFound
            ? "Espaço não encontrado ou sem permissão de acesso."
            : "Não foi possível carregar os ambientes."}
        </Text>
        <Button
          type="button"
          variant="outline"
          h="10"
          px="4"
          loading={query.isFetching}
          onClick={() => { void query.refetch(); }}
        >
          Tentar novamente
        </Button>
      </Flex>
    );
  }

  if (query.data.length === 0) {
    return <EmptyState action={{ label: "Novo ambiente", onClick: onNewRoomClick }} />;
  }

  return null;
}
