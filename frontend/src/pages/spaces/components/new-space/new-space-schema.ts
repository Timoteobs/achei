import { object, string } from "yup";
import type { InferType } from "yup";

export const newSpaceSchema = object({
  name: string()
    .trim()
    .required("Digite o nome do espaço.")
    .max(100, "Use até 100 caracteres."),
  description: string()
    .trim()
    .max(500, "Use até 500 caracteres.")
    .defined(),
  imageUrl: string()
    .trim()
    .url("Informe uma URL de imagem válida.")
    .max(1000, "Use até 1000 caracteres.")
    .defined(),
});

export type NewSpaceValues = InferType<typeof newSpaceSchema>;
