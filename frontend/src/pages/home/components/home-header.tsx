import {
  Avatar,
  Box,
  Flex,
  Grid,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { Input } from "../../../components/input/input";
import { useAuthStore } from "../../../stores/auth-store";
import { NewItemBanner } from "./new-item/new-item-banner";

export function HomeHeader({
  onNewItemClick,
}: Readonly<{ onNewItemClick?: () => void }>) {
  const user = useAuthStore((state) => state.session?.user);
  const firstName = user?.name.trim().split(/\s+/)[0] || "Olá";

  return (
    <Box as="header">
      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          xl: "minmax(0, 1fr) minmax(360px, 510px)",
        }}
        gap={{ base: "5", xl: "8" }}
        alignItems="start"
      >
        <Box minW="0">
          <Heading
            as="h1"
            color="fg.default"
            fontSize={{ base: "xl", md: "22px" }}
            fontWeight="bold"
            lineHeight="1.25"
            letterSpacing="tight"
          >
            {user ? `Olá, ${firstName}!` : "Olá!"}{" "}
            <Box as="span" fontSize="xl" aria-hidden="true">
              👋
            </Box>
          </Heading>
          <Text color="fg.default" fontSize="13px" mt="2" lineHeight="1.5">
            Organize seus espaços e encontre seus itens em segundos.
          </Text>
        </Box>
        <Flex gap={{ base: "3", md: "4" }} align="center" minW="0">
          <Box flex="1" minW="0">
            <Input
              type="search"
              name="search"
              aria-label="Buscar itens"
              placeholder="O que você está procurando?"
              startElement={<Search size={16} strokeWidth={1.8} />}
              h="9"
              fontSize="xs"
              borderRadius="md"
              boxShadow="xs"
            />
          </Box>
          <IconButton
            asChild
            aria-label="Notificações"
            boxSize="9"
            minW="9"
            flexShrink="0"
            borderRadius="full"
            bg="bg.subtle"
            color="fg.muted"
            variant="ghost"
            position="relative"
            _hover={{ bg: "brand.subtle", color: "brand.fg" }}
          >
            <Link to="/notificacoes">
              <Bell size={18} strokeWidth={1.8} />
              <Box
                position="absolute"
                top="1.5"
                right="1.5"
                boxSize="1.5"
                borderRadius="full"
                bg="brand.solid"
                aria-hidden="true"
              />
            </Link>
          </IconButton>
          <Avatar.Root
            boxSize="9"
            flexShrink="0"
            bg="bg.subtle"
            color="brand.fg"
            aria-label={user?.name ?? "Usuário"}
          >
            <Avatar.Fallback fontSize="sm" fontWeight="semibold">
              {firstName.slice(0, 1).toLocaleUpperCase("pt-BR")}
            </Avatar.Fallback>
            {user?.avatarUrl && (
              <Avatar.Image src={user.avatarUrl} alt={user.name} />
            )}
          </Avatar.Root>
        </Flex>
      </Grid>
      <NewItemBanner onNewItemClick={onNewItemClick} />
    </Box>
  );
}
