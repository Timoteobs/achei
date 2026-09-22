import {
  Briefcase,
  Building2,
  Ellipsis,
  House,
  Store,
  TreePalm,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ColorVariant } from "../../../components/color-variants";

export const spaceIconsMock: {
  label: string;
  icon: LucideIcon;
  variant: ColorVariant;
}[] = [
  { label: "Casa", icon: House, variant: "teal" },
  { label: "Prédio", icon: Building2, variant: "blue" },
  { label: "Loja", icon: Store, variant: "purple" },
  { label: "Praia", icon: TreePalm, variant: "purple" },
  { label: "Escritório", icon: Briefcase, variant: "orange" },
  { label: "Mais ícones", icon: Ellipsis, variant: "cyan" },
];

export const spaceColorsMock = [
  { label: "Verde", color: "brand.500" },
  { label: "Azul", color: "blue.200" },
  { label: "Violeta", color: "purple.300" },
  { label: "Rosa", color: "pink.200" },
  { label: "Laranja", color: "orange.200" },
  { label: "Amarelo", color: "yellow.200" },
  { label: "Turquesa", color: "teal.200" },
  { label: "Cinza", color: "neutral.300" },
];
