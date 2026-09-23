import { CirclePlus, ClipboardList, Pencil, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { InfoCardProps } from "../../../../components/info-card/info-card";

export const activityStatsMock = [
  {
    id: "total",
    value: 24,
    label: "Total de atividades",
    description: "Últimos 30 dias",
    icon: ClipboardList,
    variant: "neutral",
  },
  {
    id: "added",
    value: 8,
    label: "Itens adicionados",
    description: "Últimos 30 dias",
    icon: CirclePlus,
    variant: "green",
  },
  {
    id: "updated",
    value: 5,
    label: "Itens atualizados",
    description: "Últimos 30 dias",
    icon: Pencil,
    variant: "blue",
  },
  {
    id: "removed",
    value: 2,
    label: "Itens removidos",
    description: "Últimos 30 dias",
    icon: Trash2,
    variant: "pink",
  },
] satisfies (Omit<InfoCardProps, "icon" | "layout"> & {
  id: string;
  icon: LucideIcon;
})[];
