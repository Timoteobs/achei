import { Stack, useTabsContext } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../components/button/button";
import type { RoomResponse } from "../../../../services/rooms";
import { NewBoxModal } from "./new-box/new-box-modal";
import { BoxesGrid } from "./boxes-grid";
import { BoxesHeader } from "./boxes-header";

export function BoxesTab({ room }: Readonly<{ room: RoomResponse }>) {
  const [isNewBoxOpen, setIsNewBoxOpen] = useState(false);
  const tabs = useTabsContext();
  return (
    <Stack gap="6" minW="0">
      <Button type="button" variant="link" alignSelf="start" gap="2" onClick={() => tabs.setValue("rooms")}>
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para Ambientes
      </Button>
      <BoxesHeader roomName={room.name} onNewBoxClick={() => setIsNewBoxOpen(true)} />
      <BoxesGrid roomId={room.id} onNewBoxClick={() => setIsNewBoxOpen(true)} />
      {isNewBoxOpen && <NewBoxModal open initialRoomId={room.id} onOpenChange={setIsNewBoxOpen} />}
    </Stack>
  );
}
