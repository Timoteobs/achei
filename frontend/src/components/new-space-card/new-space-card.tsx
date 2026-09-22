import { AddCard } from "../add-card/add-card";

export function NewSpaceCard({ onClick }: Readonly<{ onClick?: () => void }>) {
  return <AddCard label="Novo espaço" onClick={onClick} />;
}
