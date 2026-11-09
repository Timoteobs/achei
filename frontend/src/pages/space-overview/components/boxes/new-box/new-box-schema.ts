import { object, string } from "yup";
import type { InferType } from "yup";

export const newBoxSchema = object({
  name: string().trim().required("Digite o nome da caixa.").max(100, "Use até 100 caracteres."),
  description: string().trim().max(500, "Use até 500 caracteres.").defined(),
  roomId: string().required("Selecione um ambiente.").matches(/^[1-9]\d*$/, "Selecione um ambiente válido."),
});

export type NewBoxValues = InferType<typeof newBoxSchema>;
