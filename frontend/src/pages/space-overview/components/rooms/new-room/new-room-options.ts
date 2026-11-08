import { Armchair, BedDouble, Car, DoorOpen, Laptop, ShowerHead, Utensils, WashingMachine } from "lucide-react";
import type { ColorVariant } from "../../../../../components/color-variants";

export const roomIconOptions = [
  { value: "armchair", label: "Sala", icon: Armchair },
  { value: "utensils", label: "Cozinha", icon: Utensils },
  { value: "bed-double", label: "Quarto", icon: BedDouble },
  { value: "shower-head", label: "Banheiro", icon: ShowerHead },
  { value: "car", label: "Garagem", icon: Car },
  { value: "laptop", label: "Escritório", icon: Laptop },
  { value: "washing-machine", label: "Lavanderia", icon: WashingMachine },
  { value: "door-open", label: "Outro ambiente", icon: DoorOpen },
] as const;

export const roomColorOptions = [
  { value: "teal", label: "Verde Achei!" },
  { value: "blue", label: "Azul" },
  { value: "green", label: "Verde" },
  { value: "purple", label: "Roxo" },
  { value: "orange", label: "Laranja" },
  { value: "pink", label: "Rosa" },
  { value: "neutral", label: "Cinza" },
] as const satisfies ReadonlyArray<{ value: ColorVariant; label: string }>;
