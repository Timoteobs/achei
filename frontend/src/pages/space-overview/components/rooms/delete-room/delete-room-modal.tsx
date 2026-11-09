import { ConfirmationModal } from "../../../../../components/confirmation-modal/confirmation-modal";
import { useDeleteRoomMutation } from "../../../../../hooks/rooms/use-delete-room-mutation";
import type { RoomResponse } from "../../../../../services/rooms";

interface DeleteRoomModalProps {
  spaceId: string;
  room: Pick<RoomResponse, "id" | "name"> | null;
  onClose: () => void;
}

export function DeleteRoomModal({ spaceId, room, onClose }: Readonly<DeleteRoomModalProps>) {
  const deleteMutation = useDeleteRoomMutation(spaceId);

  return (
    <ConfirmationModal
      open={room !== null}
      title="Excluir ambiente"
      description={
        <>
          Tem certeza de que deseja excluir o ambiente <strong>{room?.name}</strong>?
          {" "}Esta ação não pode ser desfeita.
        </>
      }
      confirmLabel="Excluir ambiente"
      loadingText="Excluindo..."
      destructive
      isLoading={deleteMutation.isPending}
      onOpenChange={(open) => {
        if (!open && !deleteMutation.isPending) {
          onClose();
          deleteMutation.reset();
        }
      }}
      onConfirm={() => {
        if (room && !deleteMutation.isPending) {
          deleteMutation.mutate(room.id, { onSuccess: onClose });
        }
      }}
    />
  );
}
