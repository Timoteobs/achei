import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { useId } from "react";
import { Button } from "../../../components/button/button";
import { ItemListItem } from "../../../components/item-list-item/item-list-item";
import { recentItemsMock } from "../recent-items-mock";

export function RecentItemsSection() {
  const headingId = useId();

  return (
    <Box
      as="section"
      aria-labelledby={headingId}
      minW="0"
      p="5"
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="lg"
    >
      <Heading
        as="h2"
        id={headingId}
        color="fg.default"
        fontSize="lg"
        fontWeight="semibold"
      >
        Itens recentes
      </Heading>
      <Text color="fg.muted" fontSize="sm" mt="1" mb="5">
        Últimos itens adicionados, movidos ou atualizados neste espaço.
      </Text>
      <Stack as="ul" gap="3" listStyleType="none" m="0" p="0">
        {recentItemsMock.map(({ id, ...item }) => (
          <Box as="li" key={id} minW="0">
            <ItemListItem {...item} />
          </Box>
        ))}
      </Stack>
      <Button
        type="button"
        variant="link"
        w="full"
        mt="5"
        px="3"
        gap="2"
        bg="brand.subtle"
        borderRadius="sm"
        fontSize="sm"
        _hover={{ bg: "brand.muted" }}
      >
        Ver todos os itens
        <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
      </Button>
    </Box>
  );
}
