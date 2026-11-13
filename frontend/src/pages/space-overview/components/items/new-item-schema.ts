import { number, object, string } from "yup";
import type { InferType } from "yup";

export const newItemSchema = object({
  spaceId: string().required("Selecione um espaço.").matches(/^[1-9]\d*$/, "Selecione um espaço válido."),
  name: string().trim().required("Digite o nome do item.").max(150, "Use até 150 caracteres."),
  description: string().trim().max(1000, "Use até 1000 caracteres.").defined(),
  notes: string().trim().max(1000, "Use até 1000 caracteres.").defined(),
  quantity: number().typeError("Informe uma quantidade válida.")
    .required("Informe a quantidade.").integer("Use uma quantidade inteira.")
    .min(1, "A quantidade deve ser maior que zero.").max(2147483647, "Quantidade acima do limite permitido."),
  roomId: string().required("Selecione um ambiente.").matches(/^[1-9]\d*$/, "Selecione um ambiente válido."),
  boxId: string().defined().matches(/^[1-9]\d*$/, { message: "Selecione uma caixa válida.", excludeEmptyString: true }),
});

export type NewItemValues = InferType<typeof newItemSchema>;
