import { Box, Grid, Heading } from "@chakra-ui/react";
import { useId } from "react";
import { QuickAccessCard } from "../../../components/quick-access-card/quick-access-card";
import { quickAccessMock } from "../quick-access-mock";

export function QuickAccessSection() {
  const headingId = useId();

  return (
    <Box as="section" aria-labelledby={headingId} mt="8" minW="0">
      <Heading
        as="h2"
        id={headingId}
        color="fg.default"
        fontSize="lg"
        fontWeight="semibold"
        mb="4"
      >
        Acessos rápidos
      </Heading>
      <Grid
        as="ul"
        templateColumns={{
          base: "repeat(auto-fit, minmax(min(100%, 10rem), 1fr))",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        }}
        autoRows="1fr"
        gap={{ base: "3", md: "4" }}
        listStyleType="none"
        m="0"
        p="0"
      >
        {quickAccessMock.map(({ id, ...access }) => (
          <Box as="li" key={id} minW="0">
            <QuickAccessCard {...access} />
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
