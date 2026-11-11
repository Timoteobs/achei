import { Box, CirclePlus, DoorOpen, History, House, Package, Pencil, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ColorVariant } from "../../../../components/color-variants";
import type { ActivityResponse } from "../../../../services/activities";

const entities: Record<string, { label: string; name: string; icon: LucideIcon }> = {
  SPACE: { label: "um espaço", name: "Espaço", icon: House },
  ROOM: { label: "um ambiente", name: "Ambiente", icon: DoorOpen },
  BOX: { label: "uma caixa", name: "Caixa", icon: Box },
  ITEM: { label: "um item", name: "Item", icon: Package },
};

const actions: Record<string, { verb: string; icon: LucideIcon; variant: ColorVariant }> = {
  CREATED: { verb: "criou", icon: CirclePlus, variant: "green" },
  UPDATED: { verb: "atualizou", icon: Pencil, variant: "blue" },
  DELETED: { verb: "removeu", icon: Trash2, variant: "pink" },
};

function getActivityName(metadata: string | null) {
  if (!metadata) return undefined;
  try {
    const value: unknown = JSON.parse(metadata);
    if (value && typeof value === "object" && "name" in value && typeof value.name === "string") {
      return value.name.trim() || undefined;
    }
  } catch {
    // O histórico permanece visível mesmo quando um registro antigo contém JSON inválido.
  }
  return undefined;
}

export function getActivityPresentation(activity: ActivityResponse, currentUserId?: number) {
  const entity = entities[activity.entityType] ?? { label: "um registro", name: "Registro", icon: History };
  const action = actions[activity.action] ?? { verb: "registrou uma atividade em", icon: History, variant: "teal" as const };
  const author = activity.userId === null ? "Usuário removido" : activity.userId === currentUserId ? "Você" : "Outro usuário";

  return {
    title: `${author} ${action.verb} ${entity.label}`,
    icon: action.icon,
    iconVariant: action.variant,
    targetIcon: entity.icon,
    name: getActivityName(activity.metadata) ?? `${entity.name}${activity.entityId === null ? "" : ` #${activity.entityId}`}`,
  };
}
