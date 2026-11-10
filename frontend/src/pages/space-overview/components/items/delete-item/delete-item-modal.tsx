import { ConfirmationModal } from "../../../../../components/confirmation-modal/confirmation-modal";
import { useDeleteItemMutation } from "../../../../../hooks/items/use-delete-item-mutation";
import type { ItemResponse } from "../../../../../services/items";

interface DeleteItemModalProps {
  spaceId: string;
  item: Pick<ItemResponse, "id" | "name"> | null;
  onClose: () => void;
}

export function DeleteItemModal({ spaceId, item, onClose }: Readonly<DeleteItemModalProps>) {
  const deleteMutation = useDeleteItemMutation(spaceId);

  return (
    <ConfirmationModal
      open={item !== null}
      title="Excluir item"
      description={
        <>
          Tem certeza de que deseja excluir o item <strong>{item?.name}</strong>?
          {" "}Esta ação não pode ser desfeita.
        </>
      }
      confirmLabel="Excluir item"
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
        if (item && !deleteMutation.isPending) {
          deleteMutation.mutate(item.id, { onSuccess: onClose });
        }
      }}
    />
  );
}