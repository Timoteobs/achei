import { Box, Flex, Heading, Text, chakra } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "../../components/brand-logo/brand-logo";
import { Button } from "../../components/button/button";
import { Input } from "../../components/input/input";

export function ForgotPasswordPage() {
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
          Esqueceu sua senha?
        </Heading>
        <Text
          textAlign="center"
          color="fg.muted"
          fontSize="sm"
          lineHeight="1.7"
          mt="2"
          mb="8"
        >
          Não se preocupe. Informe o e-mail associado à sua conta e enviaremos as
          instruções para redefinir sua senha.
        </Text>
        <chakra.form
          aria-label="Recuperar senha"
          noValidate
          onSubmit={(event) => event.preventDefault()}
        >
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
          <Button type="submit" h="46px" mt="6">
            Enviar link de recuperação
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
