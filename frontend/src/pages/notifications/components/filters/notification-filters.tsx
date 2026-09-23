import { Flex } from "@chakra-ui/react";
import { Check } from "lucide-react";
import { Button } from "../../../../components/button/button";
import { FilterChip } from "../../../../components/filter-chip/filter-chip";
import { notificationFiltersMock } from "./notification-filters-mock";

export function NotificationFilters() {
  return (
    <Flex
      align="center"
      justify="space-between"
      flexWrap="wrap"
      columnGap="6"
      rowGap="3"
      w="full"
      minW="0"
      mt="6"
    >
      <Flex
        role="group"
        aria-label="Filtros de notificações"
        flexWrap="wrap"
        gap="3"
        minW="0"
      >
        {notificationFiltersMock.map(({ id, label, count, active }) => (
          <FilterChip key={id} active={active} badge={count}>
            {label}
          </FilterChip>
        ))}
      </Flex>

      <Button
        type="button"
        variant="outline"
        w="auto"
        h={{ base: "10", md: "8" }}
        px="3"
        ms="auto"
        flexShrink="0"
        gap="1.5"
        borderRadius="sm"
        bg="bg.surface"
        color="fg.muted"
        fontSize="xs"
        fontWeight="medium"
      >
        <Check size={14} strokeWidth={1.8} aria-hidden="true" />
        Marcar todas como lidas
      </Button>
    </Flex>
  );
}
