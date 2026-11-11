import { Box, Flex, Heading, Spinner, Text, Timeline } from "@chakra-ui/react";
import { useEffect, useId, useRef } from "react";
import { Button } from "../../../../components/button/button";
import { EmptyState } from "../../../../components/empty-state/empty-state";
import { ItemListItem } from "../../../../components/item-list-item/item-list-item";
import { TimelineItem } from "../../../../components/timeline-item/timeline-item";
import { useActivitiesQuery } from "../../../../hooks/activities/use-activities-query";
import type { SpaceResponse } from "../../../../services/spaces";
import { useAuthStore } from "../../../../stores/auth-store";
import { formatDateTime } from "../../../../utils/date";
import { getActivityPresentation } from "./activity-presentation";

export function ActivityTimeline({ space }: Readonly<{ space?: SpaceResponse }>) {
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
        fontSize="md"
        fontWeight="semibold"
        color="fg.default"
        px="4"
        py="3"
        borderBottomWidth="1px"
        borderColor="border.default"
      >
        Atividades recentes
      </Heading>
      {space ? (
        <SpaceActivityTimeline key={space.id} space={space} />
      ) : (
        <EmptyState description="As atividades aparecerão aqui quando você cadastrar e organizar seus espaços." />
      )}
    </Box>
  );
}

function SpaceActivityTimeline({ space }: Readonly<{ space: SpaceResponse }>) {
  const userId = useAuthStore((state) => state.session?.user.id);
  const query = useActivitiesQuery(String(space.id));
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { fetchNextPage, hasNextPage, isFetching, isError } = query;
  const activities = Array.from(new Map(
    query.data?.pages.flatMap((page) => page.items).map((activity) => [activity.id, activity]),
  ).values());

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetching || isError || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        void fetchNextPage({ cancelRefetch: false });
      }
    }, { rootMargin: "200px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isError, activities.length]);

  return (
    <Box aria-busy={query.isFetching}>
      {query.isPending ? (
        <TimelineLoading message="Carregando atividades..." />
      ) : query.isError && activities.length === 0 ? (
        <TimelineError message="Não foi possível carregar as atividades deste espaço." loading={query.isFetching} onRetry={() => { void query.refetch(); }} />
      ) : activities.length > 0 ? (
        <>
          <Timeline.Root
            variant="plain"
            showLastSeparator={false}
            aria-label="Histórico de atividades"
            px={{ base: "3", md: "5" }}
            pb="1"
            minW="0"
          >
            {activities.map((activity) => {
              const { name, targetIcon, ...presentation } = getActivityPresentation(activity, userId);
              return (
                <TimelineItem key={activity.id} {...presentation} date={formatDateTime(activity.createdAt)}>
                  <ItemListItem name={name} icon={targetIcon} location={[space.name]} />
                </TimelineItem>
              );
            })}
          </Timeline.Root>
          <Box ref={loadMoreRef} h="1px" aria-hidden="true" />
          <Box borderTopWidth="1px" borderColor="border.default">
            {query.isError ? (
              <TimelineError
                message={query.isFetchNextPageError ? "Não foi possível carregar mais atividades." : "Não foi possível atualizar as atividades."}
                loading={query.isFetching}
                onRetry={() => {
                  if (query.isFetchNextPageError) {
                    void query.fetchNextPage({ cancelRefetch: false });
                  } else {
                    void query.refetch();
                  }
                }}
              />
            ) : query.isFetchingNextPage ? (
              <TimelineLoading message="Carregando mais atividades..." />
            ) : query.hasNextPage ? (
              <Flex justify="center" p="4">
                <Button type="button" variant="outline" h="10" px="4" disabled={query.isFetching} onClick={() => { void query.fetchNextPage({ cancelRefetch: false }); }}>
                  Carregar mais atividades
                </Button>
              </Flex>
            ) : (
              <Text p="4" fontSize="sm" textAlign="center" color="fg.muted" role="status">
                Todas as atividades foram carregadas.
              </Text>
            )}
          </Box>
        </>
      ) : (
        <EmptyState description="As ações realizadas neste espaço aparecerão aqui." />
      )}
    </Box>
  );
}

function TimelineLoading({ message }: Readonly<{ message: string }>) {
  return (
    <Flex role="status" align="center" gap="3" p="5" color="fg.muted">
      <Spinner size="sm" color="brand.fg" />
      <Text fontSize="sm">{message}</Text>
    </Flex>
  );
}

function TimelineError({ message, loading, onRetry }: Readonly<{ message: string; loading: boolean; onRetry: () => void }>) {
  return (
    <Flex align="center" gap="3" wrap="wrap" p="5">
      <Text role="alert" color="fg.muted" fontSize="sm">{message}</Text>
      <Button type="button" variant="outline" h="10" px="4" loading={loading} onClick={onRetry}>Tentar novamente</Button>
    </Flex>
  );
}
