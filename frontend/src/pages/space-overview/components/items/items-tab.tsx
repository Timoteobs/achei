import { Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { SelectedBoxContext } from "./selected-box-context";
import { ItemsHeader } from "./items-header";
import { ItemsTable } from "./items-table";
import { NewItemModal } from "./new-item-modal";
import type { ItemLocation } from "./new-item-modal";

export function ItemsTab({ location }: Readonly<{ location?: ItemLocation }>) {
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);

  return (
    <Stack gap="6" minW="0">
      {location ? (
        <Text color="fg.muted" fontSize="sm">Ambiente selecionado para novos itens: {location.room}</Text>
      ) : <SelectedBoxContext />}
      <ItemsHeader onNewItemClick={() => setIsNewItemModalOpen(true)} />
      <ItemsTable />
      <NewItemModal
        location={location}
        open={isNewItemModalOpen}
        onOpenChange={setIsNewItemModalOpen}
      />
    </Stack>
  );
}
