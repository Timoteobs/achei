import { Stack } from "@chakra-ui/react";
import { SelectedBoxContext } from "./selected-box-context";
import { ItemsHeader } from "./items-header";
import { ItemsTable } from "./items-table";

export function ItemsTab() {
  return (
    <Stack gap="6" minW="0">
      <SelectedBoxContext />
      <ItemsHeader />
      <ItemsTable />
    </Stack>
  );
}
