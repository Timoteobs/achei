import { ConfirmationModal } from "../../../../components/confirmation-modal/confirmation-modal";
import { useRevokeInvitationMutation } from "../../../../hooks/invitations/use-revoke-invitation-mutation";
import type { InvitationResponse } from "../../../../services/invitations";

interface RevokeInvitationModalProps {
  spaceId: string;
  invitation: Pick<InvitationResponse, "id" | "email" | "status"> | null;
  onClose: () => void;
}

export function RevokeInvitationModal({ spaceId, invitation, onClose }: Readonly<RevokeInvitationModalProps>) {
  const revokeMutation = useRevokeInvitationMutation(spaceId);

  return (
    <ConfirmationModal
      open={invitation !== null}
      title="Revogar acesso ao espaço"
      description={
        <>
          Deseja revogar {invitation?.email ? <>o acesso de <strong>{invitation.email}</strong></> : "este acesso"}?
          {" "}A pessoa será removida dos membros e não poderá mais visualizar ou editar este espaço.
          Os itens que ela cadastrou serão mantidos.
        </>
      }
      confirmLabel="Revogar acesso"
      cancelLabel="Manter acesso"
      loadingText="Revogando..."
      destructive
      isLoading={revokeMutation.isPending}
      onOpenChange={(open) => {
        if (!open && !revokeMutation.isPending) {
          onClose();
          revokeMutation.reset();
        }
      }}
      onConfirm={() => {
        if (invitation?.status === "ACCEPTED" && !revokeMutation.isPending) {
          revokeMutation.mutate(invitation.id, { onSuccess: onClose });
        }
      }}
    />
  );
}
