import { Box, Grid } from "@chakra-ui/react";
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

export function RoomsGrid({ onNewRoomClick, onRoomClick }: Readonly<{
  onNewRoomClick: () => void;
  onRoomClick: (roomId: number) => void;
}>) {
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const roomsQuery = useRoomsQuery(spaceId);
  const [roomToDelete, setRoomToDelete] = useState<RoomResponse | null>(null);
  const [roomToEdit, setRoomToEdit] = useState<RoomResponse | null>(null);

  return (
    <Box aria-busy={roomsQuery.isFetching}>
      <RoomsQueryFeedback query={roomsQuery} onNewRoomClick={onNewRoomClick} />
      {!!roomsQuery.data?.length && <Grid
        as="ul"
        aria-label="Lista de ambientes"
        templateColumns={{ base: "minmax(0, 1fr)", sm: "repeat(auto-fill, minmax(220px, 1fr))" }}
        gap="5"
        alignItems="stretch"
        listStyleType="none"
        m="0"
        p="0"
      >
        <Box as="li" minW="0" minH="220px">
          <AddCard label="Novo ambiente" size="lg" onClick={onNewRoomClick} />
        </Box>
        {roomsQuery.data?.map((room) => (
          <Box as="li" key={room.id} minW="0">
            <RoomCard
              {...getRoomCardProps(room)}
              layout="detailed"
              onOpen={() => onRoomClick(room.id)}
              onDelete={() => setRoomToDelete(room)}
              onEdit={() => setRoomToEdit(room)}
            />
          </Box>
        ))}
      </Grid>}
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
