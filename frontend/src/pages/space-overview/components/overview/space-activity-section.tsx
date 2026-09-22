import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { useId } from "react";
import { ActivityItem } from "../../../../components/activity-item/activity-item";
import { Button } from "../../../../components/button/button";
import { spaceActivitiesMock } from "./space-activities-mock";

export function SpaceActivitySection() {
  const headingId = useId();

  return (
    <Box
      as="section"
      aria-labelledby={headingId}
      display="flex"
      flexDirection="column"
      minW="0"
      h="full"
      p="5"
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="lg"
    >
      <Heading
        as="h2"
        id={headingId}
        color="fg.default"
        fontSize="lg"
        fontWeight="semibold"
      >
        Atividade no espaço
      </Heading>
      <Text color="fg.muted" fontSize="sm" mt="1" mb="5">
        Acompanhe as últimas atividades realizadas pelos membros.
      </Text>
      <Stack as="ul" gap="4" flex="1" listStyleType="none" m="0" p="0">
        {spaceActivitiesMock.map(({ id, ...activity }) => (
          <Box as="li" key={id} minW="0">
            <ActivityItem {...activity} />
          </Box>
        ))}
      </Stack>
      <Button
        type="button"
        variant="link"
        w="full"
        mt="5"
        px="3"
        gap="2"
        bg="brand.subtle"
        borderRadius="sm"
        fontSize="sm"
        _hover={{ bg: "brand.muted" }}
      >
        Ver todas as atividades
        <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
      </Button>
    </Box>
  );
}
