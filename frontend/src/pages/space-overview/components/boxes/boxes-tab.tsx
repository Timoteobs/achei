import { Stack } from "@chakra-ui/react";
import { BoxesGrid } from "./boxes-grid";
import { BoxesHeader } from "./boxes-header";

export function BoxesTab() {
  return (
    <Stack gap="6" minW="0">
      <BoxesHeader />
      <BoxesGrid />
    </Stack>
  );
}
