import { SimpleGrid } from "@chakra-ui/react";
import { InfoCard } from "../../../../components/info-card/info-card";
import { activityStatsMock } from "./activity-stats-mock";

export function ActivityStats() {
  return (
    <SimpleGrid
      as="section"
      aria-label="Indicadores de atividades nos últimos 30 dias"
      columns={{ base: 1, md: 2, xl: 4 }}
      gap="4"
      mt="6"
      minW="0"
    >
      {activityStatsMock.map(({ id, icon: Icon, ...stat }) => (
        <InfoCard
          key={id}
          {...stat}
          layout="stat"
          icon={<Icon size={24} strokeWidth={1.8} />}
        />
      ))}
    </SimpleGrid>
  );
}
