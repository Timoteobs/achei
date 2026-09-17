import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { BrandLogo } from "../../components/brand-logo/brand-logo";
import { Button } from "../../components/button/button";
import { RegisterForm } from "./components/register-form";

export function RegisterPage() {
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
      <Box w="full" maxW="440px">
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
          Crie sua conta
        </Heading>
        <Text
          textAlign="center"
          color="fg.muted"
          fontSize="sm"
          lineHeight="1.7"
          mt="2"
          mb="8"
        >
          Comece a organizar suas coisas de um jeito simples.
        </Text>
        <RegisterForm />
        <Flex
          justify="center"
          align="center"
          flexWrap="wrap"
          gap="1.5"
          mt="6"
          fontSize="sm"
        >
          <Text color="fg.muted">Já possui uma conta?</Text>
          <Button variant="link" asChild fontSize="sm" fontWeight="semibold">
            <Link to="/login">Entrar</Link>
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
