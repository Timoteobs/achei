import { boolean, object, string } from "yup";

export const loginSchema = object({
  email: string()
    .trim()
    .email("Digite um e-mail válido.")
    .required("Digite um e-mail válido."),
  password: string().required("Digite sua senha."),
  rememberMe: boolean().defined(),
});
