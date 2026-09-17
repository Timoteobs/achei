import { Box, Flex, Text } from "@chakra-ui/react";
import { AuthBrandPanel } from "./components/auth/auth-brand-panel";
import { LoginForm } from "./components/auth/login-form";
import { BrandLogo } from "../../components/brand-logo/brand-logo";

export function LoginPage() {
  return (
    <Flex minH="100dvh" bg="bg.surface">
      <AuthBrandPanel />
      <Flex
        as="main"
        flex="1"
        minW="0"
        minH="100dvh"
        direction="column"
        justify={{ base: "flex-start", md: "center" }}
        align="center"
        px={{ base: "6", md: "8", lg: "10", xl: "16" }}
        py={{ base: "10", md: "12" }}
      >
        <Box w="full" maxW="420px">
          <Box display={{ base: "block", md: "none" }} mb="12">
            <BrandLogo />
          </Box>
          <LoginForm />
          <Text
            display={{ base: "block", md: "none" }}
            color="fg.muted"
            fontSize="xs"
            textAlign="center"
            mt="12"
          >
            Suas coisas sempre ao seu alcance.
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
