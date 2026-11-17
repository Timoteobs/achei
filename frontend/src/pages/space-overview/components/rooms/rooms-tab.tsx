import { useSpacePermissions } from "../../../../hooks/spaces/use-space-permissions";
import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { NewRoomModal } from "./new-room/new-room-modal";
import { RoomsGrid } from "./rooms-grid";
import { RoomsHeader } from "./rooms-header";

export function RoomsTab({ onRoomClick }: Readonly<{ onRoomClick: (roomId: number) => void }>) {
  const { canEdit } = useSpacePermissions();
  const [isNewRoomOpen, setIsNewRoomOpen] = useState(false);
  return (
    <Stack gap="6" minW="0">
      <RoomsHeader onNewRoomClick={() => setIsNewRoomOpen(true)} />
      <RoomsGrid onNewRoomClick={() => setIsNewRoomOpen(true)} onRoomClick={onRoomClick} />
      {canEdit && <NewRoomModal open={isNewRoomOpen} onOpenChange={setIsNewRoomOpen} />}
    </Stack>
  );
}
