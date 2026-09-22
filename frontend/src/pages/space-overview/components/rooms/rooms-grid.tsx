import { Box, SimpleGrid } from "@chakra-ui/react";
import { AddCard } from "../../../../components/add-card/add-card";
import { RoomCard } from "../../../../components/room-card/room-card";
import { roomsMock } from "./rooms-mock";

export function RoomsGrid() {
  return (
    <SimpleGrid as="ul" columns={{ base: 1, md: 2, xl: 3 }} gap="5" listStyleType="none" m="0" p="0">
      {roomsMock.map(({ id, ...room }) => (
        <Box as="li" key={id} minW="0">
          <RoomCard {...room} layout="detailed" />
        </Box>
      ))}
      <Box as="li" minW="0">
        <AddCard label="Novo ambiente" size="lg" />
      </Box>
    </SimpleGrid>
  );
}
