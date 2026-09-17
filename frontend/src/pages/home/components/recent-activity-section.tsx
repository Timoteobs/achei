import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useId } from "react";
import { ActivityItem } from "../../../components/activity-item/activity-item";
import { Button } from "../../../components/button/button";
import { recentActivitiesMock } from "../recent-activities-mock";

export function RecentActivitySection() {
  const headingId = useId();

  return (
    <Box as="section" aria-labelledby={headingId} mt="8" minW="0">
      <Flex align="center" justify="space-between" gap="3" mb="4">
        <Heading
          as="h2"
          id={headingId}
          color="fg.default"
          fontSize="lg"
          fontWeight="semibold"
        >
          Atividade recente
        </Heading>
        <Button type="button" variant="link" fontSize="sm" flexShrink="0">
          Ver todas
        </Button>
      </Flex>
      <Stack as="ul" gap="4" listStyleType="none" m="0" p="0">
        {recentActivitiesMock.map(({ id, ...activity }) => (
          <Box as="li" key={id} minW="0">
            <ActivityItem {...activity} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
