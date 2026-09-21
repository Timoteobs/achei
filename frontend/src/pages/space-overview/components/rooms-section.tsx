import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { useId } from "react";
import { AddCard } from "../../../components/add-card/add-card";
import { Button } from "../../../components/button/button";
import { RoomCard } from "../../../components/room-card/room-card";
import { roomsMock } from "../rooms-mock";
import { spaceSummaryMock } from "../space-summary-mock";

export function RoomsSection() {
  const headingId = useId();

  return (
    <Box as="section" aria-labelledby={headingId} minW="0">
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
        <Button type="button" variant="link" gap="2">
          Ver todos ({spaceSummaryMock.roomsCount})
          <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
        </Button>
        <Text gridColumn="1 / -1" color="fg.muted" fontSize="sm">
          Gerencie os ambientes da sua casa e encontre seus itens mais
          facilmente.
        </Text>
      </Grid>
      <Flex
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
        {roomsMock.map(({ id, ...room }) => (
          <Box as="li" key={id} flexShrink="0">
            <RoomCard {...room} />
          </Box>
        ))}
        <Box as="li" flexShrink="0">
          <AddCard label="Novo ambiente" size="sm" />
        </Box>
      </Flex>
    </Box>
  );
}
