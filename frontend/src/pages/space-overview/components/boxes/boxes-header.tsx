import { CollectionHeader } from "../../../../components/collection-header/collection-header";

export function BoxesHeader({ roomName, onNewBoxClick }: Readonly<{ roomName: string; onNewBoxClick: () => void }>) {
  return (
    <CollectionHeader
      title="Caixas"
      description={`Ambiente: ${roomName}. Organize seus itens em caixas e encontre tudo mais facilmente.`}
      actionLabel="Nova caixa"
      onActionClick={onNewBoxClick}
      searchLabel="Buscar caixas"
    />
  );
}
