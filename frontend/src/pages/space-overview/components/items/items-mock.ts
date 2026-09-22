import type { ColorVariant } from "../../../../components/color-variants";
import type { ItemStatus } from "./item-status-badge";

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryVariant: ColorVariant;
  createdAt: string;
  status: ItemStatus;
}

export const itemsMock = [
  {
    id: "furadeira",
    name: "Furadeira Bosch",
    description: "Modelo GSB 18V-50",
    category: "Ferramentas",
    categoryVariant: "blue",
    createdAt: "12 de jan. de 2024",
    status: "in-use",
  },
  {
    id: "jogo-chaves",
    name: "Jogo de chaves",
    description: "Philips e fenda",
    category: "Ferramentas",
    categoryVariant: "blue",
    createdAt: "10 de jan. de 2024",
    status: "stored",
  },
  {
    id: "trena",
    name: "Trena",
    description: "5 metros",
    category: "Medição",
    categoryVariant: "purple",
    createdAt: "8 de jan. de 2024",
    status: "stored",
  },
  {
    id: "martelo",
    name: "Martelo",
    description: "500g",
    category: "Ferramentas",
    categoryVariant: "blue",
    createdAt: "5 de jan. de 2024",
    status: "stored",
  },
  {
    id: "caixa-organizadora",
    name: "Caixa organizadora",
    description: "Pequena",
    category: "Organização",
    categoryVariant: "orange",
    createdAt: "3 de jan. de 2024",
    status: "stored",
  },
  {
    id: "fita-isolante",
    name: "Fita isolante",
    description: "Preta",
    category: "Elétricos",
    categoryVariant: "pink",
    createdAt: "2 de jan. de 2024",
    status: "stored",
  },
] satisfies Item[];

export const itemsTotalCount = 12;
