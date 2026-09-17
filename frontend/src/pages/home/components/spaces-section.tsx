import { Box, Flex, Heading } from "@chakra-ui/react";
import { useId } from "react";
import { NewSpaceCard } from "../../../components/new-space-card/new-space-card";
import { SpaceCard } from "../../../components/space-card/space-card";
import type { SpaceCardProps } from "../../../components/space-card/space-card";

export function SpacesSection({
  spaces,
}: Readonly<{ spaces: readonly (SpaceCardProps & { id: string })[] }>) {
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
        Meus espaços
      </Heading>
      <Flex
        as="ul"
        aria-label="Lista de espaços"
        tabIndex={0}
        gap="5"
        flexWrap={"wrap"}
        scrollbarWidth="thin"
        listStyleType="none"
        m="0"
        p="1"
        pb="3"
        borderRadius="md"
      >
        {spaces.map(({ id, ...space }) => (
          <Box as="li" key={id} flexShrink="0">
            <SpaceCard {...space} />
          </Box>
        ))}
        <Box as="li" flexShrink="0">
          <NewSpaceCard />
        </Box>
      </Flex>
    </Box>
  );
}
