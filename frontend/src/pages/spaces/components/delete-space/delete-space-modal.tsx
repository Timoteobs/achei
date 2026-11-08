import { ConfirmationModal } from "../../../../components/confirmation-modal/confirmation-modal";
import { useDeleteSpaceMutation } from "../../../../hooks/spaces/use-delete-space-mutation";
import type { SpaceResponse } from "../../../../services/spaces";

interface DeleteSpaceModalProps {
  space: Pick<SpaceResponse, "id" | "name" | "ownerUserId"> | null;
  onClose: () => void;
  onDeleted?: () => void | Promise<void>;
}

export function DeleteSpaceModal({
  space,
  onClose,
  onDeleted,
}: Readonly<DeleteSpaceModalProps>) {
  const deleteMutation = useDeleteSpaceMutation(async () => {
    await onDeleted?.();
    onClose();
  });

  return (
    <ConfirmationModal
      open={space !== null}
      title="Excluir espaço"
      description={
        <>
          Tem certeza de que deseja excluir o espaço <strong>{space?.name}</strong>?
          {" "}Esta ação não pode ser desfeita.
        </>
      }
      confirmLabel="Excluir espaço"
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
        if (space && !deleteMutation.isPending) deleteMutation.mutate(space);
      }}
    />
  );
}
