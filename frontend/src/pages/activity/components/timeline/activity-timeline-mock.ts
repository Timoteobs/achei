import {
  BriefcaseBusiness,
  CirclePlus,
  Drill,
  FileText,
  FolderInput,
  Gamepad2,
  House,
  LampDesk,
  PackagePlus,
  Pencil,
  Ruler,
  Sprout,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import type { ItemListItemProps } from "../../../../components/item-list-item/item-list-item";
import type { TimelineItemProps } from "../../../../components/timeline-item/timeline-item";

export const activityTimelineMock = [
  {
    id: "drill-added",
    title: "Timóteo adicionou um novo item",
    date: "Hoje, 14:32",
    icon: CirclePlus,
    iconVariant: "green",
    target: {
      name: "Furadeira Bosch",
      icon: Drill,
      location: ["Caixa de ferramentas", "Garagem", "Minha Casa"],
    },
  },
  {
    id: "tape-updated",
    title: "Timóteo atualizou um item",
    date: "Hoje, 11:20",
    icon: Pencil,
    iconVariant: "blue",
    target: {
      name: "Trena",
      icon: Ruler,
      location: ["Caixa de ferramentas", "Garagem", "Minha Casa"],
    },
  },
  {
    id: "box-created",
    title: "Timóteo criou uma nova caixa",
    date: "Ontem, 18:05",
    icon: PackagePlus,
    iconVariant: "purple",
    target: {
      name: "Material elétrico",
      icon: BriefcaseBusiness,
      location: ["Escritório", "Minha Casa"],
    },
  },
  {
    id: "plant-moved",
    title: "Timóteo moveu um item",
    date: "Ontem, 16:22",
    icon: FolderInput,
    iconVariant: "orange",
    target: {
      name: "Planta decorativa",
      icon: Sprout,
      location: ["Sala → Varanda", "Minha Casa"],
    },
  },
  {
    id: "lamp-removed",
    title: "Timóteo removeu um item",
    date: "12 de jan. de 2024, 09:14",
    icon: Trash2,
    iconVariant: "pink",
    target: {
      name: "Abajur",
      icon: LampDesk,
      location: ["Lixeira", "Minha Casa"],
    },
  },
  {
    id: "apartment-shared",
    title: "Timóteo compartilhou um espaço",
    date: "10 de jan. de 2024, 20:41",
    icon: Users,
    iconVariant: "purple",
    target: {
      name: "Apartamento",
      icon: House,
      location: ["com 2 pessoas"],
    },
  },
  {
    id: "document-favorited",
    title: "Timóteo favoritou um item",
    date: "8 de jan. de 2024, 13:27",
    icon: Star,
    iconVariant: "blue",
    target: {
      name: "Documento do carro",
      image: "/images/items/passport.jpg",
      icon: FileText,
      location: ["Caixa 1", "Quarto", "Minha Casa"],
    },
  },
  {
    id: "controller-added",
    title: "Timóteo adicionou um novo item",
    date: "5 de jan. de 2024, 17:03",
    icon: CirclePlus,
    iconVariant: "green",
    target: {
      name: "Controle de videogame",
      icon: Gamepad2,
      location: ["Caixa de eletrônicos", "Quarto", "Minha Casa"],
    },
  },
] satisfies (Omit<TimelineItemProps, "children"> & {
  id: string;
  target: Omit<ItemListItemProps, "time" | "locationSeparator">;
})[];
