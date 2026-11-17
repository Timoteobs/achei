import { Box } from "@chakra-ui/react";
import { CollectionHeader } from "../../components/collection-header/collection-header";
import { ReceivedInvitationsList } from "./components/received-invitations-list";

export function InvitationsPage() {
  return (
    <Box as="main" flex="1" minW="0" px={{ base: "5", md: "6", lg: "8" }} py="5">
      <CollectionHeader
        title="Convites"
        description="Veja os convites recebidos para participar de outros espaços."
        searchLabel="Buscar convites"
        showFilters={false}
      />
      <ReceivedInvitationsList />
    </Box>
  );
}
