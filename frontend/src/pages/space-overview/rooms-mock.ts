import {
  Armchair,
  BedDouble,
  Car,
  Laptop,
  ShowerHead,
  Utensils,
} from "lucide-react";
import type { RoomCardProps } from "../../components/room-card/room-card";

export const roomsMock = [
  { id: "sala", name: "Sala", itemsCount: 18, icon: Armchair, variant: "blue" },
  {
    id: "cozinha",
    name: "Cozinha",
    itemsCount: 24,
    icon: Utensils,
    variant: "green",
  },
  {
    id: "quarto",
    name: "Quarto",
    itemsCount: 15,
    icon: BedDouble,
    variant: "purple",
  },
  {
    id: "banheiro",
    name: "Banheiro",
    itemsCount: 8,
    icon: ShowerHead,
    variant: "cyan",
  },
  {
    id: "garagem",
    name: "Garagem",
    itemsCount: 12,
    icon: Car,
    variant: "orange",
  },
  {
    id: "escritorio",
    name: "Escritório",
    itemsCount: 10,
    icon: Laptop,
    variant: "teal",
  },
] satisfies (RoomCardProps & { id: string })[];
