import {
  Box,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Text,
  chakra,
} from "@chakra-ui/react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../components/button/button";
import { Input } from "../../../../components/input/input";
import { loginSchema } from "./login-schema";
import { SocialLogin } from "./social-login";
import type { LoginValues } from "./types";

export function LoginForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onTouched",
  });

  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (values: LoginValues) => {
    console.log(values);
  };

  return (
    <Box w="full">
      <Heading
        as="h1"
        fontSize={{ base: "28px", lg: "32px" }}
        fontWeight="semibold"
        lineHeight="1.25"
        letterSpacing="-0.9px"
      >
        Bem-vindo de volta
      </Heading>
      <Text color="fg.muted" fontSize="sm" lineHeight="1.8" mt="3" mb="8">
        <Box as="span" display={{ base: "inline", md: "none" }}>
          Entre na sua conta para continuar.
        </Box>
        <Box as="span" display={{ base: "none", md: "inline" }}>
          Entre na sua conta para continuar organizando seus espaços.
        </Box>
      </Text>

      <chakra.form
        noValidate
        onSubmit={(event) => {
          void handleSubmit(submit)(event);
        }}
        aria-label="Entrar na sua conta"
        aria-busy={isSubmitting}
      >
        <Flex direction="column" gap="5">
          <Input
            id={`${id}-email`}
            label="E-mail"
            errorText={errors.email?.message}
            required
            startElement={<Mail size={18} strokeWidth={1.6} />}
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="seu@email.com"
            {...register("email")}
          />

          <Input
            id={`${id}-password`}
            label="Senha"
            errorText={errors.password?.message}
            required
            startElement={<LockKeyhole size={18} strokeWidth={1.6} />}
            endElement={
              <IconButton
                type="button"
                variant="ghost"
                h="40px"
                w="40px"
                minW="40px"
                color="fg.muted"
                borderRadius="sm"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                aria-pressed={showPassword}
                aria-controls={`${id}-password`}
                onClick={() => setShowPassword((visible) => !visible)}
                _hover={{ bg: "bg.subtle", color: "fg.default" }}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.6} />
                ) : (
                  <Eye size={18} strokeWidth={1.6} />
                )}
              </IconButton>
            }
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Digite sua senha"
            {...register("password")}
          />
        </Flex>

        <Flex
          mt="4"
          mb="7"
          align="center"
          justify="space-between"
          gap="2"
          flexWrap="wrap"
        >
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox.Root
                colorPalette="brand"
                checked={field.value}
                onCheckedChange={({ checked }) =>
                  field.onChange(checked === true)
                }
                size="sm"
                gap="2"
                cursor="pointer"
                py="2"
              >
                <Checkbox.HiddenInput
                  ref={field.ref}
                  name={field.name}
                  onBlur={field.onBlur}
                />
                <Checkbox.Control
                  borderColor="border.emphasized"
                  borderRadius="xs"
                  _checked={{
                    bg: "brand.solid",
                    borderColor: "brand.solid",
                    color: "brand.contrast",
                  }}
                >
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label
                  fontSize="13px"
                  color="fg.muted"
                  fontWeight="regular"
                >
                  Lembrar de mim
                </Checkbox.Label>
              </Checkbox.Root>
            )}
          />
          <Button variant="link" asChild>
            <Link to="/forgot-password">Esqueci minha senha</Link>
          </Button>
        </Flex>

        <Button type="submit" loading={isSubmitting} loadingText="Entrando...">
          Entrar
          <ArrowRight size={17} strokeWidth={1.7} aria-hidden="true" />
        </Button>
      </chakra.form>

      <Flex
        justify="center"
        align="center"
        gap="1.5"
        flexWrap="wrap"
        mt="5"
        fontSize="13px"
      >
        <Text color="fg.muted">Ainda não tem uma conta?</Text>
        <Button variant="link" fontWeight="semibold" asChild>
          <Link to="/register">Criar conta</Link>
        </Button>
      </Flex>
      <SocialLogin
        disabled={false}
        onSelect={(provider) => {
          console.log(provider);
        }}
      />
    </Box>
  );
}
