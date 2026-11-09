import { Box, SimpleGrid } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { AddCard } from "../../../../components/add-card/add-card";
import { RoomCard } from "../../../../components/room-card/room-card";
import { useRoomsQuery } from "../../../../hooks/rooms/use-rooms-query";
import { getRoomCardProps } from "./room-card-props";
import { RoomsQueryFeedback } from "./rooms-query-feedback";

export function RoomsGrid({ onNewRoomClick }: Readonly<{ onNewRoomClick: () => void }>) {
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const roomsQuery = useRoomsQuery(spaceId);

  return (
    <Box aria-busy={roomsQuery.isFetching}>
      <RoomsQueryFeedback query={roomsQuery} onNewRoomClick={onNewRoomClick} />
      {!!roomsQuery.data?.length && <SimpleGrid as="ul" aria-label="Lista de ambientes" columns={{ base: 1, md: 2, xl: 3 }} gap="5" listStyleType="none" m="0" p="0">
        {roomsQuery.data?.map((room) => (
          <Box as="li" key={room.id} minW="0">
            <RoomCard {...getRoomCardProps(room)} layout="detailed" />
          </Box>
        ))}
        <Box as="li" minW="0">
          <AddCard label="Novo ambiente" size="lg" onClick={onNewRoomClick} />
        </Box>
      </SimpleGrid>}
    </Box>
  );
}
