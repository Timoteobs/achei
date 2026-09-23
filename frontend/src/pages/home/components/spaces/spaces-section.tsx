import { Box, Flex, Heading } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useId } from "react";
import { NewSpaceCard } from "../../../../components/new-space-card/new-space-card";
import { SpaceCard } from "../../../../components/space-card/space-card";
import type { SpaceCardProps } from "../../../../components/space-card/space-card";

export function SpacesSection({
  spaces,
  showTitle = true,
  onNewSpaceClick,
}: Readonly<{
  spaces: readonly (SpaceCardProps & { id: string })[];
  showTitle?: boolean;
  onNewSpaceClick?: () => void;
}>) {
  const headingId = useId();

  return (
    <Box
      as="section"
      aria-labelledby={showTitle ? headingId : undefined}
      mt="8"
      minW="0"
    >
      {showTitle && (
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
      )}
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
        <Box as="li" flexShrink="0">
          <NewSpaceCard onClick={onNewSpaceClick} />
        </Box>
        {spaces.map(({ id, ...space }) => (
          <Box as="li" key={id} flexShrink="0">
            <Box asChild display="block" h="full" borderRadius="md">
              <Link to="/espacos/$spaceId" params={{ spaceId: id }}>
                <SpaceCard {...space} />
              </Link>
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
