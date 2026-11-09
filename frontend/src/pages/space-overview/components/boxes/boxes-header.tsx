import { CollectionHeader } from "../../../../components/collection-header/collection-header";

export function BoxesHeader({ onNewBoxClick }: Readonly<{ onNewBoxClick: () => void }>) {
  return (
    <CollectionHeader
      title="Caixas"
      description="Organize seus itens em caixas e encontre tudo mais facilmente."
      actionLabel="Nova caixa"
      onActionClick={onNewBoxClick}
      searchLabel="Buscar caixas"
    />
  );
}
