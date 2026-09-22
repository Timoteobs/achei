import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { SelectedBoxContext } from "./selected-box-context";
import { ItemsHeader } from "./items-header";
import { ItemsTable } from "./items-table";
import { NewItemModal } from "./new-item-modal";

export function ItemsTab() {
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);

  return (
    <Stack gap="6" minW="0">
      <SelectedBoxContext />
      <ItemsHeader onNewItemClick={() => setIsNewItemModalOpen(true)} />
      <ItemsTable />
      <NewItemModal
        open={isNewItemModalOpen}
        onOpenChange={setIsNewItemModalOpen}
      />
    </Stack>
  );
}
