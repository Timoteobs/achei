import { Flex, Text } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { Button } from "../../../../components/button/button";
import { EmptyState } from "../../../../components/empty-state/empty-state";
import type { useRoomsQuery } from "../../../../hooks/rooms/use-rooms-query";
import type { RoomCardProps } from "../../../../components/room-card/room-card";
import { RoomsSkeleton } from "./rooms-skeleton";

export function RoomsQueryFeedback({ query, onNewRoomClick, layout = "detailed" }: Readonly<{
  query: ReturnType<typeof useRoomsQuery>;
  onNewRoomClick: () => void;
  layout?: RoomCardProps["layout"];
}>) {
  if (query.isPending) {
    return <RoomsSkeleton layout={layout} />;
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
