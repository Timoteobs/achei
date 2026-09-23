import { Box, Heading, Timeline } from "@chakra-ui/react";
import { useId } from "react";
import { ItemListItem } from "../../../../components/item-list-item/item-list-item";
import { TimelineItem } from "../../../../components/timeline-item/timeline-item";
import { activityTimelineMock } from "./activity-timeline-mock";

export function ActivityTimeline() {
  const headingId = useId();

  return (
    <Box
      as="section"
      aria-labelledby={headingId}
      mt="6"
      minW="0"
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="md"
      overflow="hidden"
    >
      <Heading
        as="h2"
        id={headingId}
        px="4"
        py="3"
        fontSize="md"
        fontWeight="semibold"
        color="fg.default"
        borderBottomWidth="1px"
        borderColor="border.default"
      >
        Atividades recentes
      </Heading>
      <Timeline.Root
        variant="plain"
        showLastSeparator={false}
        aria-label="Histórico de atividades"
        px={{ base: "3", md: "5" }}
        pb="1"
        minW="0"
      >
        {activityTimelineMock.map(({ id, target, ...activity }) => (
          <TimelineItem key={id} {...activity}>
            <ItemListItem {...target} locationSeparator=" • " />
          </TimelineItem>
        ))}
      </Timeline.Root>
    </Box>
  );
}
