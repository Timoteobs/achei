import { Clock3, Heart, ImageOff, Trash2 } from "lucide-react";
import type { QuickAccessCardProps } from "../../../../components/quick-access-card/quick-access-card";

export const quickAccessMock = [
  {
    id: "recent",
    title: "Itens recentes",
    count: 12,
    icon: Clock3,
    variant: "recent",
  },
  {
    id: "favorites",
    title: "Meus favoritos",
    count: 8,
    icon: Heart,
    variant: "favorites",
  },
  {
    id: "without-photo",
    title: "Itens sem foto",
    count: 5,
    icon: ImageOff,
    variant: "withoutPhoto",
  },
  { id: "trash", title: "Lixeira", count: 3, icon: Trash2, variant: "trash" },
] satisfies (QuickAccessCardProps & { id: string })[];
