import { ConfirmationModal } from "../../../../../components/confirmation-modal/confirmation-modal";
import { useDeleteBoxMutation } from "../../../../../hooks/boxes/use-delete-box-mutation";
import type { BoxResponse } from "../../../../../services/boxes";

interface DeleteBoxModalProps {
  spaceId: string;
  box: Pick<BoxResponse, "id" | "name"> | null;
  onClose: () => void;
}

export function DeleteBoxModal({ spaceId, box, onClose }: Readonly<DeleteBoxModalProps>) {
  const deleteMutation = useDeleteBoxMutation(spaceId);

  return (
    <ConfirmationModal
      open={box !== null}
      title="Excluir caixa"
      description={
        <>
          Tem certeza de que deseja excluir a caixa <strong>{box?.name}</strong>?
          {" "}Esta ação não pode ser desfeita.
        </>
      }
      confirmLabel="Excluir caixa"
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
        if (box && !deleteMutation.isPending) {
          deleteMutation.mutate(box.id, { onSuccess: onClose });
        }
      }}
    />
  );
}
