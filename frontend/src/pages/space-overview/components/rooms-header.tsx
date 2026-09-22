import { CollectionHeader } from "../../../components/collection-header/collection-header";

export function RoomsHeader() {
  return (
    <CollectionHeader
      title="Ambientes"
      description="Organize sua casa por ambientes e encontre seus itens mais facilmente."
      actionLabel="Novo ambiente"
      searchLabel="Buscar ambientes"
    />
  );
}
