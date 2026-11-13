import { Flex, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import { CirclePlus, ClipboardList, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../../components/button/button";
import { InfoCard } from "../../../../components/info-card/info-card";
import { useActivityIndicatorsQuery } from "../../../../hooks/activities/use-activity-indicators-query";

const indicators = [
  { field: "totalActivities", label: "Total de atividades", icon: ClipboardList, variant: "neutral" },
  { field: "itemsAdded", label: "Itens adicionados", icon: CirclePlus, variant: "green" },
  { field: "itemsUpdated", label: "Itens atualizados", icon: Pencil, variant: "blue" },
  { field: "itemsRemoved", label: "Itens removidos", icon: Trash2, variant: "pink" },
] as const;

export function ActivityStats({ spaceId }: Readonly<{ spaceId: string }>) {
  const query = useActivityIndicatorsQuery(spaceId);

  if (query.isError) {
    return (
      <Flex as="section" aria-label="Indicadores de atividades" align="center" gap="3" wrap="wrap" mt="6">
        <Text role="alert" color="fg.muted" fontSize="sm">Não foi possível carregar os indicadores deste espaço.</Text>
        <Button type="button" variant="outline" h="10" px="4" loading={query.isFetching} onClick={() => { void query.refetch(); }}>Tentar novamente</Button>
      </Flex>
    );
  }

  return (
    <SimpleGrid
      as="section"
      aria-label="Indicadores de atividades nos últimos 30 dias"
      aria-busy={query.isFetching}
      columns={{ base: 1, md: 2, xl: 4 }}
      gap="4"
      mt="6"
      minW="0"
    >
      {indicators.map(({ field, icon: Icon, label, variant }) => (
        <InfoCard
          key={field}
          label={label}
          variant={variant}
          description="Últimos 30 dias"
          value={query.data
            ? query.data[field].toLocaleString("pt-BR")
            : <Skeleton as="span" display="inline-block" w="12" h="6" borderRadius="sm" aria-label="Carregando indicador" />}
          layout="stat"
          icon={<Icon size={24} strokeWidth={1.8} />}
        />
      ))}
    </SimpleGrid>
  );
}
