import { Box, Flex, Grid, Heading, Text, useTabsContext } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { AddCard } from "../../../../components/add-card/add-card";
import { Button } from "../../../../components/button/button";
import { RoomCard } from "../../../../components/room-card/room-card";
import { useRoomsQuery } from "../../../../hooks/rooms/use-rooms-query";
import { getRoomCardProps } from "./room-card-props";
import { RoomsQueryFeedback } from "./rooms-query-feedback";
import { NewRoomModal } from "./new-room/new-room-modal";
import { DeleteRoomModal } from "./delete-room/delete-room-modal";
import type { RoomResponse } from "../../../../services/rooms";

export function RoomsSection() {
  const headingId = useId();
  const [isNewRoomOpen, setIsNewRoomOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<RoomResponse | null>(null);
  const [roomToEdit, setRoomToEdit] = useState<RoomResponse | null>(null);
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const roomsQuery = useRoomsQuery(spaceId);
  const tabs = useTabsContext();

  return (
    <Box as="section" aria-labelledby={headingId} minW="0" aria-busy={roomsQuery.isFetching}>
      <Grid
        templateColumns="minmax(0, 1fr) auto"
        alignItems="center"
        columnGap="3"
        rowGap="1"
        mb="4"
      >
        <Heading
          as="h2"
          id={headingId}
          color="fg.default"
          fontSize="lg"
          fontWeight="semibold"
        >
          Ambientes
        </Heading>
        <Button type="button" variant="link" gap="2" onClick={() => tabs.setValue("rooms")}>
          Ver todos{roomsQuery.data ? ` (${roomsQuery.data.length})` : ""}
          <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
        </Button>
        <Text gridColumn="1 / -1" color="fg.muted" fontSize="sm">
          Gerencie os ambientes da sua casa e encontre seus itens mais
          facilmente.
        </Text>
      </Grid>
      <RoomsQueryFeedback query={roomsQuery} onNewRoomClick={() => setIsNewRoomOpen(true)} />
      {!!roomsQuery.data?.length && <Flex
        as="ul"
        aria-label="Prévia dos ambientes"
        tabIndex={0}
        gap="4"
        overflowX="auto"
        scrollbarWidth="none"
        listStyleType="none"
        m="0"
        p="1"
        borderRadius="md"
      >
        {roomsQuery.data?.map((room) => (
          <Box as="li" key={room.id} flexShrink="0">
            <RoomCard
              {...getRoomCardProps(room)}
              onDelete={() => setRoomToDelete(room)}
              onEdit={() => setRoomToEdit(room)}
            />
          </Box>
        ))}
        <Box as="li" flexShrink="0">
          <AddCard label="Novo ambiente" size="sm" onClick={() => setIsNewRoomOpen(true)} />
        </Box>
      </Flex>}
      <NewRoomModal open={isNewRoomOpen} onOpenChange={setIsNewRoomOpen} />
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
