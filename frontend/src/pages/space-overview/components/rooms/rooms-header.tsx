import { CollectionHeader } from "../../../../components/collection-header/collection-header";

export function RoomsHeader({ onNewRoomClick }: Readonly<{ onNewRoomClick: () => void }>) {
  return (
    <CollectionHeader
      title="Ambientes"
      description="Organize sua casa por ambientes e encontre seus itens mais facilmente."
      actionLabel="Novo ambiente"
      onActionClick={onNewRoomClick}
      searchLabel="Buscar ambientes"
    />
  );
}
