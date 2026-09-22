import {
  BedDouble,
  Bell,
  BriefcaseBusiness,
  Building2,
  Clock3,
  CookingPot,
  House,
  HouseHeart,
  Sofa,
  Star,
  Trash2,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SidebarSection, SidebarSpace } from "./types";

export const navigationPaths = {
  home: "/",
  search: "/buscar",
  spaces: "/espacos",
  notifications: "/notificacoes",
  favorites: "/favoritos",
  activity: "/atividade",
  trash: "/lixeira",
} as const satisfies Record<SidebarSection, string>;

export const navigationItems: { id: SidebarSection; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Início", icon: House },
  { id: "spaces", label: "Meus espaços", icon: Building2 },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "favorites", label: "Favoritos", icon: Star },
  { id: "activity", label: "Atividade", icon: Clock3 },
  { id: "trash", label: "Lixeira", icon: Trash2 },
];

export const initialSpaces: SidebarSpace[] = [
  {
    id: "casa",
    name: "Minha Casa",
    icon: House,
    locations: [
      { id: "quarto", name: "Quarto", icon: BedDouble },
      { id: "sala", name: "Sala", icon: Sofa },
      { id: "cozinha", name: "Cozinha", icon: CookingPot },
      { id: "escritorio-casa", name: "Escritório", icon: BriefcaseBusiness },
      { id: "garagem", name: "Garagem", icon: Warehouse },
    ],
  },
  { id: "escritorio", name: "Escritório", icon: Building2, locations: [] },
  { id: "casa-pais", name: "Casa dos meus pais", icon: HouseHeart, locations: [] },
];

export function findLocationPath(
  locations: SidebarSpace["locations"],
  id?: string,
): SidebarSpace["locations"] {
  for (const location of locations) {
    if (location.id === id) return [location];
    const path = findLocationPath(location.children ?? [], id);
    if (path.length) return [location, ...path];
  }
  return [];
}
