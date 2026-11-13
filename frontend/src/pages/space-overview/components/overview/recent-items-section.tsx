import { Box, Flex, Grid, Heading, Skeleton, Stack, Text, VisuallyHidden } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useId } from "react";
import { Button } from "../../../../components/button/button";
import { EmptyState } from "../../../../components/empty-state/empty-state";
import { ItemListItem } from "../../../../components/item-list-item/item-list-item";
import { useRecentItemsQuery } from "../../../../hooks/items/use-recent-items-query";
import { formatDateTime } from "../../../../utils/date";

export function RecentItemsSection() {
  const headingId = useId();
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const query = useRecentItemsQuery(spaceId);
  const notFound = isAxiosError(query.error) && query.error.response?.status === 404;

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
        Itens recentes
      </Heading>
      <Text color="fg.muted" fontSize="sm" mt="1" mb="5">
        Últimos itens adicionados, movidos ou atualizados neste espaço.
      </Text>
      {query.isPending ? (
        <Stack role="status" gap="3" flex="1">
          <VisuallyHidden>Carregando itens recentes...</VisuallyHidden>
          {Array.from({ length: 5 }, (_, index) => (
            <Grid
              key={index}
              aria-hidden="true"
              templateColumns={{ base: "auto minmax(0, 1fr)", md: "auto minmax(0, 1fr) auto" }}
              columnGap="4"
              rowGap="1"
              alignItems="start"
              minW="0"
            >
              <Skeleton boxSize="11" borderRadius="md" gridColumn="1" gridRow={{ base: "1 / 3", md: "1" }} />
              <Stack gap="2" py="1" minW="0" gridColumn="2" gridRow="1">
                <Skeleton h="4" w="70%" borderRadius="sm" />
                <Skeleton h="4" w="90%" borderRadius="sm" />
              </Stack>
              <Skeleton
                h="4"
                w="24"
                maxW="full"
                borderRadius="sm"
                gridColumn={{ base: "2", md: "3" }}
                gridRow={{ base: "2", md: "1" }}
                alignSelf={{ base: "start", md: "center" }}
              />
            </Grid>
          ))}
        </Stack>
      ) : query.isError ? (
        <Flex align="center" gap="3" wrap="wrap" py="4">
          <Text role="alert" color="fg.muted" fontSize="sm">
            {notFound ? "Espaço não encontrado ou sem permissão de acesso." : "Não foi possível carregar os itens recentes."}
          </Text>
          <Button type="button" variant="outline" h="10" px="4" loading={query.isFetching} onClick={() => { void query.refetch(); }}>
            Tentar novamente
          </Button>
        </Flex>
      ) : query.data.items.length === 0 ? (
        <EmptyState description="Os itens adicionados, movidos ou atualizados neste espaço aparecerão aqui." />
      ) : (
        <Stack as="ul" aria-label="Itens recentes do espaço" gap="3" flex="1" listStyleType="none" m="0" p="0">
          {query.data.items.map((item) => (
            <Box as="li" key={item.id} minW="0">
              <ItemListItem
                name={item.name}
                location={item.box ? [item.room.name, item.box.name] : [item.room.name]}
                time={formatDateTime(item.lastActivityAt)}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
