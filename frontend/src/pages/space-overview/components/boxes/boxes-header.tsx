import { useSpacePermissions } from "../../../../hooks/spaces/use-space-permissions";
import { CollectionHeader } from "../../../../components/collection-header/collection-header";

export function BoxesHeader({ roomName, onNewBoxClick }: Readonly<{ roomName: string; onNewBoxClick: () => void }>) {
  const { canEdit } = useSpacePermissions();
  return (
    <CollectionHeader
      title="Caixas"
      description={`Ambiente: ${roomName}. Organize seus itens em caixas e encontre tudo mais facilmente.`}
      actionLabel={canEdit ? "Nova caixa" : undefined}
      onActionClick={onNewBoxClick}
      searchLabel="Buscar caixas"
    />
  );
}
