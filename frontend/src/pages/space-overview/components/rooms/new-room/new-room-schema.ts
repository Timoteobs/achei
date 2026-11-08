import { object, string } from "yup";
import type { InferType } from "yup";
import { roomColorOptions, roomIconOptions } from "./new-room-options";

export const newRoomSchema = object({
  name: string()
    .trim()
    .required("Digite o nome do ambiente.")
    .max(100, "Use até 100 caracteres."),
  description: string().trim().max(500, "Use até 500 caracteres.").defined(),
  icon: string()
    .oneOf(roomIconOptions.map(({ value }) => value), "Selecione um ícone válido.")
    .required("Selecione um ícone."),
  color: string()
    .oneOf(roomColorOptions.map(({ value }) => value), "Selecione uma cor válida.")
    .required("Selecione uma cor."),
});

export type NewRoomValues = InferType<typeof newRoomSchema>;
