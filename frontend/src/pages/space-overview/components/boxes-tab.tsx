import { Stack } from "@chakra-ui/react";
import { BoxesHeader } from "./boxes-header";

export function BoxesTab() {
  return (
    <Stack gap="6" minW="0">
      <BoxesHeader />
    </Stack>
  );
}
