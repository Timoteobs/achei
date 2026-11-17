import { object, string } from "yup";
import type { InferType } from "yup";

export const inviteMembersSchema = object({
  email: string()
    .trim()
    .required("Digite o e-mail da pessoa.")
    .email("Digite um e-mail válido.")
    .max(255, "Use até 255 caracteres."),
  role: string()
    .oneOf(["EDITOR", "VIEWER"] as const, "Selecione uma permissão válida.")
    .required("Selecione a permissão de acesso."),
});

export type InviteMembersValues = InferType<typeof inviteMembersSchema>;
