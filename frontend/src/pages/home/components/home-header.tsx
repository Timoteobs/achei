import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import { Plus, Search } from "lucide-react";
import { Button } from "../../../components/button/button";
import { Input } from "../../../components/input/input";

export function HomeHeader({
  onNewSpaceClick,
}: Readonly<{ onNewSpaceClick?: () => void }>) {
  return (
    <Grid
      as="header"
      templateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) auto" }}
      templateAreas={{
        base: '"greeting" "search" "action"',
        md: '"greeting action" "search search"',
      }}
      columnGap="6"
      rowGap={{ base: "5", md: "8" }}
      alignItems="start"
    >
      <Box gridArea="greeting">
        <Heading
          as="h1"
          color="fg.default"
          fontSize={{ base: "2xl", lg: "3xl" }}
          fontWeight="bold"
          lineHeight="1.25"
          letterSpacing="tight"
        >
          Olá, Timóteo!{" "}
          <Box as="span" aria-hidden="true">
            👋
          </Box>
        </Heading>
        <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }} mt="2">
          Organize seus espaços e encontre seus itens em segundos.
        </Text>
      </Box>
      <Box gridArea="search" minW="0">
        <Input
          type="search"
          name="search"
          aria-label="Buscar itens"
          placeholder="O que você está procurando?"
          startElement={<Search size={20} strokeWidth={1.8} />}
          fontSize={{ base: "sm", md: "md" }}
        />
      </Box>
      <Button
        type="button"
        onClick={onNewSpaceClick}
        gridArea="action"
        w={{ base: "full", md: "auto" }}
        h="11"
        px="5"
      >
        <Plus size={20} strokeWidth={1.8} aria-hidden="true" />
        Novo espaço
      </Button>
    </Grid>
  );
}
