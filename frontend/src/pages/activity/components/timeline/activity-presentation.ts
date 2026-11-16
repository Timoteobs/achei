import { ArrowRightLeft, Box, CirclePlus, DoorOpen, History, House, Package, Pencil, Trash2 } from "lucide-react";
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
  MOVED: { verb: "moveu", icon: ArrowRightLeft, variant: "orange" },
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
  const author = getActivityAuthor(activity, currentUserId);

  return {
    title: `${author} ${action.verb} ${entity.label}`,
    icon: action.icon,
    iconVariant: action.variant,
    targetIcon: entity.icon,
    name: activity.entityName?.trim() || getActivityName(activity.metadata) || `${entity.name}${activity.entityId === null ? "" : ` #${activity.entityId}`}`,
  };
}

function getActivityAuthor(activity: ActivityResponse, currentUserId?: number) {
  if (activity.userId === null) return "Usuário removido";
  if (activity.userId === currentUserId) return "Você";
  return activity.author?.name || "Outro usuário";
}

export function getActivityItemPresentation(activity: ActivityResponse, currentUserId?: number) {
  const { name } = getActivityPresentation(activity, currentUserId);
  const entity = entities[activity.entityType] ?? { label: "um registro" };
  const verb = actions[activity.action]?.verb ?? "registrou uma atividade em";
  const authorName = activity.author?.name || getActivityAuthor(activity, currentUserId);
  const names = authorName.trim().split(/\s+/);
  const initials = [names[0], names.length > 1 ? names[names.length - 1] : ""]
    .map((part) => part?.[0] ?? "").join("").toLocaleUpperCase("pt-BR");
  const location = activity.location;
  const path = location ? [location.room.name, location.box?.name].filter(Boolean).join(" › ") : "";
  const showLocation = path && (activity.entityType === "ITEM" || activity.entityType === "BOX");
  const description = `${verb} ${entity.label} “${name}”${showLocation ? ` ${activity.action === "MOVED" ? "para" : "em"} ${path}` : ""}`;

  return {
    userName: getActivityAuthor(activity, currentUserId),
    avatarFallback: initials,
    avatarUrl: activity.author?.avatarUrl ?? undefined,
    description,
  };
}
