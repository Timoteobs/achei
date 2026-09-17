import { IconButton, Stack, chakra } from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "../../../components/button/button";
import { Input } from "../../../components/input/input";

function PasswordInput({
  name,
  label,
  placeholder,
}: Readonly<{ name: string; label: string; placeholder: string }>) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <Input
      id={id}
      name={name}
      label={label}
      placeholder={placeholder}
      type={visible ? "text" : "password"}
      autoComplete="new-password"
      h="46px"
      endElement={
        <IconButton
          type="button"
          variant="ghost"
          h="40px"
          w="40px"
          minW="40px"
          color="fg.muted"
          borderRadius="sm"
          aria-label={`${visible ? "Esconder" : "Mostrar"} ${name === "password" ? "senha" : "confirmação de senha"}`}
          aria-pressed={visible}
          aria-controls={id}
          onClick={() => setVisible((current) => !current)}
          _hover={{ bg: "bg.subtle", color: "fg.default" }}
        >
          {visible ? (
            <EyeOff size={18} strokeWidth={1.6} />
          ) : (
            <Eye size={18} strokeWidth={1.6} />
          )}
        </IconButton>
      }
    />
  );
}

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
