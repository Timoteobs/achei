import { Box, Flex, Heading, Menu, Text, chakra } from "@chakra-ui/react";
import {
  ArrowUpDown,
  ChevronDown,
  LayoutGrid,
  List,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "../button/button";
import { Input } from "../input/input";

interface CollectionHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  searchLabel: string;
  showFilters?: boolean;
  onActionClick?: () => void;
}

export function CollectionHeader({
  title,
  description,
  actionLabel,
  searchLabel,
  showFilters = true,
  onActionClick,
}: Readonly<CollectionHeaderProps>) {
  return (
    <Box as="header">
      <Flex justify="space-between" align="start" flexWrap="wrap" gap="4">
        <Box minW="0" flex="1 1 280px">
          <Heading as="h1" color="fg.default" fontSize="xl" fontWeight="bold">
            {title}
          </Heading>
          <Text color="fg.muted" fontSize="sm" mt="1">
            {description}
          </Text>
        </Box>
        {actionLabel && (
          <Button
            type="button"
            w={{ base: "full", sm: "auto" }}
            h="10"
            px="4"
            flexShrink="0"
            onClick={onActionClick}
          >
            <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
            {actionLabel}
          </Button>
        )}
      </Flex>

      {showFilters && (
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify="flex-end"
          gap="3"
          mt="4"
        >
          <Box w={{ base: "full", lg: "260px" }} minW="0">
            <Input
              type="search"
              aria-label={searchLabel}
              placeholder={`${searchLabel}...`}
              startElement={<Search size={18} strokeWidth={1.8} />}
              h="10"
              fontSize="sm"
              minW="0"
            />
          </Box>

          <Flex
            gap="3"
            flexWrap={{ base: "wrap", lg: "nowrap" }}
            flexShrink="0"
            justify={{ base: "space-between", lg: "flex-end" }}
          >
            <Menu.Root>
              <Menu.Trigger asChild>
                <chakra.button
                  type="button"
                  aria-label="Ordenar por: Mais recentes"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="2"
                  flex={{ base: "1 1 180px", lg: "0 0 auto" }}
                  minW="0"
                  h="10"
                  px="3"
                  bg="bg.surface"
                  borderWidth="1px"
                  borderColor="border.default"
                  borderRadius="sm"
                  fontSize="sm"
                  color="fg.default"
                  _hover={{ borderColor: "border.emphasized" }}
                >
                  <Flex align="center" gap="2" minW="0">
                    <Box color="fg.muted" aria-hidden="true">
                      <ArrowUpDown size={16} strokeWidth={1.8} />
                    </Box>
                    <Text as="span" fontWeight="medium" whiteSpace="nowrap">
                      Mais recentes
                    </Text>
                  </Flex>
                  <Box color="fg.muted" aria-hidden="true">
                    <ChevronDown size={16} strokeWidth={1.8} />
                  </Box>
                </chakra.button>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content
                  minW="200px"
                  bg="bg.surface"
                  borderWidth="1px"
                  borderColor="border.default"
                  borderRadius="sm"
                  p="1"
                  boxShadow="md"
                >
                  <Menu.Item value="recent" fontSize="sm">
                    Mais recentes
                  </Menu.Item>
                  <Menu.Item value="oldest" fontSize="sm">
                    Mais antigos
                  </Menu.Item>
                  <Menu.Item value="name-asc" fontSize="sm">
                    Nome (A-Z)
                  </Menu.Item>
                  <Menu.Item value="name-desc" fontSize="sm">
                    Nome (Z-A)
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>

            <Flex
              flexShrink="0"
              h="10"
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="sm"
              overflow="hidden"
            >
              <chakra.button
                type="button"
                aria-label="Visualizar em grade"
                aria-pressed="true"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="10"
                h="full"
                bg="brand.solid"
                color="brand.contrast"
              >
                <LayoutGrid size={18} strokeWidth={1.8} aria-hidden="true" />
              </chakra.button>
              <chakra.button
                type="button"
                aria-label="Visualizar em lista"
                aria-pressed="false"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="10"
                h="full"
                bg="bg.surface"
                color="fg.muted"
                borderLeftWidth="1px"
                borderColor="border.default"
                _hover={{ bg: "bg.subtle" }}
              >
                <List size={18} strokeWidth={1.8} aria-hidden="true" />
              </chakra.button>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}
