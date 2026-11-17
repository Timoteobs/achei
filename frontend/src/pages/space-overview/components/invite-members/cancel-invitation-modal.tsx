import { ConfirmationModal } from "../../../../components/confirmation-modal/confirmation-modal";
import { useCancelInvitationMutation } from "../../../../hooks/invitations/use-cancel-invitation-mutation";
import type { InvitationResponse } from "../../../../services/invitations";

interface CancelInvitationModalProps {
  spaceId: string;
  invitation: Pick<InvitationResponse, "id" | "email" | "status"> | null;
  onClose: () => void;
}

export function CancelInvitationModal({ spaceId, invitation, onClose }: Readonly<CancelInvitationModalProps>) {
  const cancelMutation = useCancelInvitationMutation(spaceId);

  return (
    <ConfirmationModal
      open={invitation !== null}
      title="Cancelar convite"
      description={
        <>
          Deseja cancelar {invitation?.email ? <>o convite para <strong>{invitation.email}</strong></> : "este convite por link"}?
          {" "}O convite será removido e seu link não poderá mais ser utilizado.
        </>
      }
      confirmLabel="Cancelar convite"
      cancelLabel="Manter convite"
      loadingText="Cancelando..."
      destructive
      isLoading={cancelMutation.isPending}
      onOpenChange={(open) => {
        if (!open && !cancelMutation.isPending) {
          onClose();
          cancelMutation.reset();
        }
      }}
      onConfirm={() => {
        if (invitation?.status === "PENDING" && !cancelMutation.isPending) {
          cancelMutation.mutate(invitation.id, { onSuccess: onClose });
        }
      }}
    />
  );
}
