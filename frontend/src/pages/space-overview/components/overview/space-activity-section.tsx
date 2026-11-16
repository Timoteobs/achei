import { Box, Flex, Heading, Skeleton, Stack, Text, VisuallyHidden } from "@chakra-ui/react";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useId } from "react";
import { ActivityItem } from "../../../../components/activity-item/activity-item";
import { Button } from "../../../../components/button/button";
import { EmptyState } from "../../../../components/empty-state/empty-state";
import { useRecentActivitiesQuery } from "../../../../hooks/activities/use-recent-activities-query";
import { useAuthStore } from "../../../../stores/auth-store";
import { formatDateTime } from "../../../../utils/date";
import { getActivityItemPresentation } from "../../../activity/components/timeline/activity-presentation";

export function SpaceActivitySection() {
  const headingId = useId();
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const userId = useAuthStore((state) => state.session?.user.id);
  const query = useRecentActivitiesQuery(spaceId);

  return (
    <Box
      as="section"
      aria-labelledby={headingId}
      aria-busy={query.isFetching}
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
      <Heading as="h2" id={headingId} color="fg.default" fontSize="lg" fontWeight="semibold">
        Atividade no espaço
      </Heading>
      <Text color="fg.muted" fontSize="sm" mt="1" mb="5">
        Acompanhe as últimas atividades realizadas pelos membros.
      </Text>
      {query.isPending ? (
        <Stack role="status" gap="4" flex="1">
          <VisuallyHidden>Carregando atividades do espaço...</VisuallyHidden>
          {Array.from({ length: 5 }, (_, index) => (
            <Flex key={index} gap="3" aria-hidden="true">
              <Skeleton boxSize="10" flexShrink="0" borderRadius="full" />
              <Stack gap="2" flex="1" minW="0" py="1">
                <Skeleton h="4" w="90%" borderRadius="sm" />
                <Skeleton h="3" w="24" maxW="full" borderRadius="sm" />
              </Stack>
            </Flex>
          ))}
        </Stack>
      ) : query.isError ? (
        <Flex align="center" gap="3" wrap="wrap" py="4">
          <Text role="alert" color="fg.muted" fontSize="sm">Não foi possível carregar as atividades do espaço.</Text>
          <Button type="button" variant="outline" h="10" px="4" loading={query.isFetching} onClick={() => { void query.refetch(); }}>
            Tentar novamente
          </Button>
        </Flex>
      ) : query.data.items.length === 0 ? (
        <EmptyState description="As ações realizadas neste espaço aparecerão aqui." />
      ) : (
        <Stack as="ul" aria-label="Últimas atividades do espaço" gap="4" flex="1" listStyleType="none" m="0" p="0">
          {query.data.items.map((activity) => (
            <Box as="li" key={activity.id} minW="0">
              <ActivityItem {...getActivityItemPresentation(activity, userId)} time={formatDateTime(activity.createdAt)} />
            </Box>
          ))}
        </Stack>
      )}
      <Button
        asChild
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
        <Link to="/atividade" search={{ spaceId: Number(spaceId) }}>
          Ver todas as atividades
          <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
        </Link>
      </Button>
    </Box>
  );
}
