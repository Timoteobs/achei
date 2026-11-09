import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { NewBoxModal } from "./new-box/new-box-modal";
import { BoxesGrid } from "./boxes-grid";
import { BoxesHeader } from "./boxes-header";

export function BoxesTab() {
  const [isNewBoxOpen, setIsNewBoxOpen] = useState(false);
  return (
    <Stack gap="6" minW="0">
      <BoxesHeader onNewBoxClick={() => setIsNewBoxOpen(true)} />
      <BoxesGrid onNewBoxClick={() => setIsNewBoxOpen(true)} />
      {isNewBoxOpen && <NewBoxModal open onOpenChange={setIsNewBoxOpen} />}
    </Stack>
  );
}
