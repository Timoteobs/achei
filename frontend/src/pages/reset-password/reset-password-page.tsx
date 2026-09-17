import { Box, Flex, Heading, Stack, Text, chakra } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "../../components/brand-logo/brand-logo";
import { Button } from "../../components/button/button";
import { PasswordInput } from "../../components/input/password-input";

export function ResetPasswordPage() {
  return (
    <Flex
      as="main"
      minH="100dvh"
      bg="bg.canvas"
      color="fg.default"
      align="center"
      justify="center"
      px="6"
      py={{ base: "10", md: "16" }}
    >
      <Box w="full" maxW="420px">
        <Flex justify="center" mb="6">
          <BrandLogo />
        </Flex>
        <Heading
          as="h1"
          textAlign="center"
          fontSize={{ base: "28px", md: "32px" }}
          fontWeight="semibold"
          lineHeight="1.25"
          letterSpacing="-0.9px"
        >
          Crie uma nova senha
        </Heading>
        <Text
          textAlign="center"
          color="fg.muted"
          fontSize="sm"
          lineHeight="1.7"
          mt="2"
          mb="8"
        >
          Escolha uma nova senha para acessar sua conta.
        </Text>
        <chakra.form
          aria-label="Redefinir senha"
          noValidate
          onSubmit={(event) => event.preventDefault()}
        >
          <Stack gap="5">
            <PasswordInput
              name="password"
              label="Nova senha"
              placeholder="Digite sua nova senha"
            />
            <PasswordInput
              name="confirmPassword"
              label="Confirmar senha"
              placeholder="Digite sua nova senha novamente"
            />
          </Stack>
          <Button type="submit" h="46px" mt="6">
            Redefinir senha
          </Button>
        </chakra.form>
        <Flex justify="center" mt="6">
          <Button variant="link" asChild fontSize="sm" fontWeight="medium" gap="2">
            <Link to="/login">
              <ArrowLeft size={16} strokeWidth={1.7} aria-hidden="true" />
              Voltar para o login
            </Link>
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
