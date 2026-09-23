import { Building2, House, HouseHeart } from "lucide-react";
import type { SpaceCardProps } from "../../../../components/space-card/space-card";

export const spacesMock = [
  {
    id: "casa",
    name: "Minha Casa",
    membersCount: 4,
    itemsCount: 103,
    icon: House,
  },
  {
    id: "escritorio",
    name: "Escritório",
    membersCount: 6,
    itemsCount: 48,
    icon: Building2,
  },
  {
    id: "casa-pais",
    name: "Casa dos meus pais",
    membersCount: 3,
    itemsCount: 72,
    icon: HouseHeart,
  },
] satisfies (SpaceCardProps & { id: string })[];
