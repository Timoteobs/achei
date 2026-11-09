import { Box, SimpleGrid } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { AddCard } from "../../../../components/add-card/add-card";
import { RoomCard } from "../../../../components/room-card/room-card";
import { useRoomsQuery } from "../../../../hooks/rooms/use-rooms-query";
import { getRoomCardProps } from "./room-card-props";
import { RoomsQueryFeedback } from "./rooms-query-feedback";
import { DeleteRoomModal } from "./delete-room/delete-room-modal";
import { NewRoomModal } from "./new-room/new-room-modal";
import type { RoomResponse } from "../../../../services/rooms";

export function RoomsGrid({ onNewRoomClick }: Readonly<{ onNewRoomClick: () => void }>) {
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const roomsQuery = useRoomsQuery(spaceId);
  const [roomToDelete, setRoomToDelete] = useState<RoomResponse | null>(null);
  const [roomToEdit, setRoomToEdit] = useState<RoomResponse | null>(null);

  return (
    <Box aria-busy={roomsQuery.isFetching}>
      <RoomsQueryFeedback query={roomsQuery} onNewRoomClick={onNewRoomClick} />
      {!!roomsQuery.data?.length && <SimpleGrid as="ul" aria-label="Lista de ambientes" columns={{ base: 1, md: 2, xl: 3 }} gap="5" listStyleType="none" m="0" p="0">
        {roomsQuery.data?.map((room) => (
          <Box as="li" key={room.id} minW="0">
            <RoomCard
              {...getRoomCardProps(room)}
              layout="detailed"
              onDelete={() => setRoomToDelete(room)}
              onEdit={() => setRoomToEdit(room)}
            />
          </Box>
        ))}
        <Box as="li" minW="0">
          <AddCard label="Novo ambiente" size="lg" onClick={onNewRoomClick} />
        </Box>
      </SimpleGrid>}
      <DeleteRoomModal spaceId={spaceId} room={roomToDelete} onClose={() => setRoomToDelete(null)} />
      {roomToEdit && (
        <NewRoomModal
          key={roomToEdit.id}
          open
          room={roomToEdit}
          onOpenChange={(open) => {
            if (!open) setRoomToEdit(null);
          }}
        />
      )}
    </Box>
  );
}
