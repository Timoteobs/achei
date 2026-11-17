import { useSpacePermissions } from "../../../../hooks/spaces/use-space-permissions";
import { CollectionHeader } from "../../../../components/collection-header/collection-header";
import type { ItemSort } from "../../../../services/items";

interface ItemsHeaderProps {
  onNewItemClick: () => void;
  search: string;
  sort: ItemSort;
  onSearchChange: (value: string) => void;
  onSortChange: (value: ItemSort) => void;
}

export function ItemsHeader({ onNewItemClick, search, sort, onSearchChange, onSortChange }: Readonly<ItemsHeaderProps>) {
  const { canEdit } = useSpacePermissions();
  return (
    <CollectionHeader
      title="Itens"
      description="Todos os itens contidos nesta caixa."
      actionLabel={canEdit ? "Novo item" : undefined}
      searchLabel="Buscar itens"
      onActionClick={onNewItemClick}
      searchValue={search}
      searchMaxLength={150}
      onSearchChange={onSearchChange}
      sortValue={sort}
      onSortChange={onSortChange}
      showViewToggle={false}
    />
  );
}