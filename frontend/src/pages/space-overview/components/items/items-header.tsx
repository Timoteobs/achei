import { CollectionHeader } from "../../../../components/collection-header/collection-header";

export function ItemsHeader({
  onNewItemClick,
}: Readonly<{ onNewItemClick?: () => void }>) {
  return (
    <CollectionHeader
      title="Itens"
      description="Todos os itens contidos nesta caixa."
      actionLabel="Novo item"
      searchLabel="Buscar caixas"
      onActionClick={onNewItemClick}
    />
  );
}
