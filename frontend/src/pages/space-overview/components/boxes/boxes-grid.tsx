import { Box, SimpleGrid } from "@chakra-ui/react";
import { AddCard } from "../../../../components/add-card/add-card";
import { BoxCard } from "../../../../components/box-card/box-card";
import { boxesMock } from "./boxes-mock";

export function BoxesGrid() {
  return (
    <SimpleGrid
      as="ul"
      columns={{ base: 1, md: 2, xl: 3 }}
      gap="5"
      listStyleType="none"
      m="0"
      p="0"
    >
      {boxesMock.map(({ id, ...box }) => (
        <Box as="li" key={id} minW="0">
          <BoxCard {...box} />
        </Box>
      ))}
      <Box as="li" minW="0">
        <AddCard label="Nova caixa" size="lg" />
      </Box>
    </SimpleGrid>
  );
}
