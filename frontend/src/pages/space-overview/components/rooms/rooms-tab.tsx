import { Stack } from "@chakra-ui/react";
import { RoomsGrid } from "./rooms-grid";
import { RoomsHeader } from "./rooms-header";

export function RoomsTab() {
  return (
    <Stack gap="6" minW="0">
      <RoomsHeader />
      <RoomsGrid />
    </Stack>
  );
}
