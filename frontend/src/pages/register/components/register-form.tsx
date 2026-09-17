import { Stack, chakra } from "@chakra-ui/react";
import { Button } from "../../../components/button/button";
import { Input } from "../../../components/input/input";
import { PasswordInput } from "../../../components/input/password-input";

export function RegisterForm() {
  return (
    <chakra.form
      aria-label="Criar sua conta"
      noValidate
      onSubmit={(event) => event.preventDefault()}
    >
      <Stack gap="5">
        <Input
          name="name"
          label="Nome completo"
          placeholder="Seu nome"
          autoComplete="name"
          h="46px"
        />
        <Input
          name="email"
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
          name="password"
          label="Senha"
          placeholder="Crie uma senha"
        />
        <PasswordInput
          name="confirmPassword"
          label="Confirmar senha"
          placeholder="Digite sua senha novamente"
        />
      </Stack>
      <Button type="submit" h="46px" mt="6">
        Criar conta
      </Button>
    </chakra.form>
  );
}
