import { useSpacePermissions } from "../../../../hooks/spaces/use-space-permissions";
import { CollectionHeader } from "../../../../components/collection-header/collection-header";

export function RoomsHeader({ onNewRoomClick }: Readonly<{ onNewRoomClick: () => void }>) {
  const { canEdit } = useSpacePermissions();
  return (
    <CollectionHeader
      title="Ambientes"
      description="Organize sua casa por ambientes e encontre seus itens mais facilmente."
      actionLabel={canEdit ? "Novo ambiente" : undefined}
      onActionClick={onNewRoomClick}
      searchLabel="Buscar ambientes"
    />
  );
}
