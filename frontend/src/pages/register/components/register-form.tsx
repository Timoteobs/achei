import { Stack, chakra } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/button/button";
import { Input } from "../../../components/input/input";
import { PasswordInput } from "../../../components/input/password-input";
import { useRegisterMutation } from "../../../hooks/auth/use-register-mutation";
import { registerSchema } from "./register-schema";
import type { RegisterValues } from "./register-schema";

export function RegisterForm() {
  const registerMutation = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const isBusy = isSubmitting || registerMutation.isPending;

  const submit = (values: RegisterValues) => {
    if (!registerMutation.isPending) registerMutation.mutate(values);
  };

  return (
    <chakra.form
      aria-label="Criar sua conta"
      noValidate
      aria-busy={isBusy}
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
    >
      <Stack gap="5">
        <Input
          {...register("name")}
          errorText={errors.name?.message}
          required
          label="Nome completo"
          placeholder="Seu nome"
          autoComplete="name"
          h="46px"
        />
        <Input
          {...register("email")}
          errorText={errors.email?.message}
          required
          label="E-mail"
          placeholder="seu@email.com"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          h="46px"
        />
        <PasswordInput
          {...register("password")}
          errorText={errors.password?.message}
          required
          label="Senha"
          placeholder="Crie uma senha"
        />
        <PasswordInput
          {...register("confirmPassword")}
          errorText={errors.confirmPassword?.message}
          required
          label="Confirmar senha"
          placeholder="Digite sua senha novamente"
        />
      </Stack>
      <Button
        type="submit"
        h="46px"
        mt="6"
        loading={isBusy}
        loadingText="Criando conta..."
      >
        Criar conta
      </Button>
    </chakra.form>
  );
}
