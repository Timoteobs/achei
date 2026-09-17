import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Check, Package, Search, UsersRound } from "lucide-react";
import { BrandLogo } from "../../../../components/brand-logo/brand-logo";

function AuthBenefits() {
  const benefits = [
    { icon: Package, text: "Organize seus espaços" },
    { icon: Search, text: "Encontre qualquer item rapidamente" },
    { icon: UsersRound, text: "Compartilhe com sua família" },
  ];
  return (
    <Box
      as="ul"
      display="flex"
      flexDirection="column"
      gap="5"
      mt="10"
      listStyleType="none"
    >
      {benefits.map(({ icon: Icon, text }) => (
        <Flex
          as="li"
          key={text}
          gap="3"
          align="center"
          fontSize="sm"
          lineHeight="1.6"
        >
          <Box color="brand.300" flexShrink={0}>
            <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
          </Box>
          <Text>{text}</Text>
        </Flex>
      ))}
    </Box>
  );
}

export function AuthBrandPanel() {
  return (
    <Flex
      as="aside"
      aria-label="Sobre o Achei!"
      display={{ base: "none", md: "flex" }}
      direction="column"
      position="relative"
      overflow="hidden"
      w={{ md: "40%", lg: "52%" }}
      minH="100dvh"
      px={{ md: "8", lg: "12", xl: "16" }}
      py="12"
      color="brand.contrast"
      bg="brand.solid"
      bgGradient="to-br"
      gradientFrom="brand.800"
      gradientVia="brand.solid"
      gradientTo="brand.600"
    >
      <Box
        position="absolute"
        inset="0"
        pointerEvents="none"
        color="brand.contrast"
        opacity="0.07"
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 740 1000"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M490-80v180q0 24 24 24h180M550 124v120h190M610 244v110h130M460 854H290q-24 0-24 24v150M266 930H90v100" />
          <rect x="484" y="676" width="162" height="170" rx="20" />
          <path d="m465 698 99-80 100 80M526 846v-73h70v73M120 174l49-27 49 27v58l-49 28-49-28v-58Zm0 0 49 28 49-28m-49 28v58m-24-100 49 28" />
          <circle cx="665" cy="438" r="45" />
          <path d="m697 470 50 50" />
          <circle cx="490" cy="125" r="5" />
          <circle cx="265" cy="930" r="5" />
        </svg>
      </Box>
      <Box position="relative">
        <BrandLogo inverted />
      </Box>
      <Box
        position="relative"
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        py="16"
        maxW="550px"
      >
        <Flex
          align="center"
          gap="2"
          fontSize="11px"
          fontWeight="medium"
          letterSpacing="1.3px"
          color="brand.200"
          mb="6"
        >
          <Check size={14} aria-hidden="true" />
          MENOS PROCURA. MAIS TEMPO.
        </Flex>
        <Heading
          as="h2"
          fontSize={{ md: "32px", lg: "42px", xl: "50px" }}
          lineHeight="1.16"
          fontWeight="semibold"
          letterSpacing="-1.8px"
          textWrap="balance"
        >
          Encontre suas coisas.
          <br />
          <Box as="span" color="brand.200">
            Sem precisar procurar.
          </Box>
        </Heading>
        <Text
          mt="6"
          maxW="390px"
          fontSize={{ md: "sm", lg: "md" }}
          lineHeight="1.85"
          color="brand.100"
        >
          Organize seus espaços, registre onde cada item está guardado e
          encontre tudo em segundos.
        </Text>
        <AuthBenefits />
      </Box>
      <Text position="relative" color="brand.200" fontSize="xs">
        Suas coisas sempre ao seu alcance.
      </Text>
    </Flex>
  );
}
