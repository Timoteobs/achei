import { object, ref, string } from "yup";
import type { InferType } from "yup";

export const registerSchema = object({
  name: string()
    .trim()
    .required("Digite seu nome.")
    .max(100, "Use até 100 caracteres."),
  email: string()
    .trim()
    .email("Digite um e-mail válido.")
    .required("Digite seu e-mail.")
    .max(255, "Use até 255 caracteres."),
  password: string()
    .required("Crie uma senha.")
    .min(8, "Use pelo menos 8 caracteres.")
    .max(128, "Use até 128 caracteres."),
  confirmPassword: string()
    .required("Confirme sua senha.")
    .oneOf([ref("password")], "As senhas não conferem."),
});

export type RegisterValues = InferType<typeof registerSchema>;
