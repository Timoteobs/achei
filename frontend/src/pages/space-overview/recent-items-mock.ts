import { BookOpen, Cable, CookingPot, Drill } from "lucide-react";
import type { ItemListItemProps } from "../../components/item-list-item/item-list-item";

export const recentItemsMock = [
  {
    id: "furadeira",
    name: "Furadeira Bosch",
    location: ["Garagem", "Caixa de ferramentas"],
    time: "há 12 minutos",
    icon: Drill,
  },
  {
    id: "passaporte",
    name: "Passaporte",
    location: ["Quarto", "Caixa 1"],
    time: "há 2 horas",
    icon: BookOpen,
  },
  {
    id: "cabo-hdmi",
    name: "Cabo HDMI",
    location: ["Escritório", "Gaveta 2"],
    time: "há 5 horas",
    icon: Cable,
  },
  {
    id: "panelas",
    name: "Panelas",
    location: ["Cozinha", "Armário 3"],
    time: "há 1 dia",
    icon: CookingPot,
  },
  {
    id: "livro-clean-code",
    name: "Livro: Clean Code",
    location: ["Escritório", "Estante"],
    time: "há 1 dia",
    icon: BookOpen,
  },
] satisfies (ItemListItemProps & { id: string })[];
