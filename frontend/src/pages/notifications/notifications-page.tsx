import { Box } from "@chakra-ui/react";
import { CollectionHeader } from "../../components/collection-header/collection-header";
import { NotificationFilters } from "./components/notification-filters";
import { NotificationList } from "./components/notification-list";

export function NotificationsPage() {
  return (
    <Box
      as="main"
      flex="1"
      minW="0"
      px={{ base: "5", md: "6", lg: "8" }}
      py="5"
    >
      <CollectionHeader
        title="Notificações"
        description="Acompanhe as atualizações dos seus espaços."
        searchLabel="Buscar notificações"
        showFilters={false}
      />
      <NotificationFilters />
      <NotificationList />
    </Box>
  );
}
