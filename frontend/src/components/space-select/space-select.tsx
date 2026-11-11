import { Box, Flex, Popover, Portal, Spinner, Stack, Text, chakra } from "@chakra-ui/react";
import { Check, ChevronDown, House, Plus, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "../input/input";

export interface SpaceSelectOption {
  id: number;
  name: string;
  description?: string;
  icon?: LucideIcon;
}

export interface SpaceSelectProps {
  spaces: readonly SpaceSelectOption[];
  value?: number;
  onValueChange: (spaceId: number) => void;
  onCreateSpace?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function SpaceSelect({
  spaces, value, onValueChange, onCreateSpace, loading = false, disabled = false,
}: Readonly<SpaceSelectProps>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedSpace = spaces.find((space) => space.id === value);
  const SelectedIcon = selectedSpace?.icon ?? House;
  const normalizedSearch = normalizeSearch(search);
  const filteredSpaces = spaces.filter((space) => normalizeSearch(space.name).includes(normalizedSearch));

  const close = () => {
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={({ open: nextOpen }) => {
        setOpen(nextOpen);
        if (!nextOpen) setSearch("");
      }}
      positioning={{ placement: "bottom-start", sameWidth: true, gutter: 8 }}
      initialFocusEl={() => searchRef.current}
      lazyMount
      unmountOnExit
    >
      <Popover.Trigger asChild>
        <chakra.button
          type="button"
          disabled={disabled || loading}
          aria-label={loading ? "Carregando espaços" : `Selecionar espaço: ${selectedSpace?.name ?? "nenhum selecionado"}`}
          display="flex"
          alignItems="center"
          gap="3"
          w="full"
          minH="52px"
          px="3"
          py="1.5"
          textAlign="start"
          bg="brand.subtle"
          borderWidth="1px"
          borderColor="brand.solid"
          borderRadius="lg"
          color="fg.default"
          cursor="pointer"
          _hover={{ bg: "brand.muted" }}
          _focusVisible={{ outline: "2px solid", outlineColor: "brand.focusRing", outlineOffset: "2px" }}
          _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
        >
          <Flex boxSize="9" flexShrink="0" align="center" justify="center" bg="brand.muted" color="brand.fg" borderRadius="md" aria-hidden="true">
            {loading ? <Spinner size="sm" /> : <SelectedIcon size={21} strokeWidth={1.8} />}
          </Flex>
          <Box flex="1" minW="0">
            <Text fontSize="xs" color="fg.muted" lineHeight="short">Espaço</Text>
            <Text fontSize="sm" fontWeight="semibold" truncate>
              {loading ? "Carregando espaços..." : selectedSpace?.name ?? "Selecione um espaço"}
            </Text>
          </Box>
          <ChevronDown size={18} strokeWidth={1.8} aria-hidden="true" />
        </chakra.button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            aria-label="Selecionar espaço"
            w="var(--reference-width)"
            maxW="calc(100vw - 32px)"
            p="2"
            bg="bg.surface"
            borderWidth="1px"
            borderColor="border.default"
            borderRadius="lg"
            boxShadow="md"
          >
            <Box p="1" pb="2">
              <Input
                ref={searchRef}
                type="search"
                aria-label="Buscar espaço"
                placeholder="Buscar espaço..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                startElement={<Search size={16} strokeWidth={1.8} />}
                h="9"
                fontSize="sm"
              />
            </Box>
            <Stack gap="1" maxH="64" overflowY="auto" role="group" aria-label="Espaços disponíveis">
              {filteredSpaces.map((space) => {
                const selected = space.id === value;
                const Icon = space.icon ?? House;
                return (
                  <chakra.button
                    key={space.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => { onValueChange(space.id); close(); }}
                    display="flex"
                    alignItems="center"
                    gap="3"
                    w="full"
                    minH="52px"
                    px="2"
                    py="2"
                    textAlign="start"
                    borderRadius="md"
                    bg={selected ? "brand.subtle" : "transparent"}
                    cursor="pointer"
                    _hover={{ bg: selected ? "brand.muted" : "bg.subtle" }}
                    _focusVisible={{ outline: "2px solid", outlineColor: "brand.focusRing", outlineOffset: "-2px" }}
                  >
                    <Flex boxSize="9" align="center" justify="center" flexShrink="0" borderRadius="md" bg={selected ? "brand.muted" : "bg.subtle"} color={selected ? "brand.fg" : "fg.muted"} aria-hidden="true">
                      <Icon size={21} strokeWidth={1.8} />
                    </Flex>
                    <Box flex="1" minW="0">
                      <Text fontSize="sm" fontWeight="semibold" color="fg.default" overflowWrap="anywhere">{space.name}</Text>
                      {space.description && <Text fontSize="xs" color="fg.muted" overflowWrap="anywhere">{space.description}</Text>}
                    </Box>
                    {selected && <Box color="brand.fg" flexShrink="0" aria-hidden="true"><Check size={19} strokeWidth={2.2} /></Box>}
                  </chakra.button>
                );
              })}
              {filteredSpaces.length === 0 && (
                <Text role="status" fontSize="sm" color="fg.muted" px="3" py="4">
                  {spaces.length === 0 ? "Nenhum espaço cadastrado." : "Nenhum espaço encontrado."}
                </Text>
              )}
            </Stack>
            {onCreateSpace && (
              <Box borderTopWidth="1px" borderColor="border.default" mt="2" pt="1">
                <chakra.button
                  type="button"
                  onClick={() => { close(); onCreateSpace(); }}
                  display="flex"
                  alignItems="center"
                  gap="3"
                  w="full"
                  h="10"
                  px="3"
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight="semibold"
                  color="brand.fg"
                  cursor="pointer"
                  _hover={{ bg: "brand.subtle" }}
                  _focusVisible={{ outline: "2px solid", outlineColor: "brand.focusRing", outlineOffset: "-2px" }}
                >
                  <Plus size={19} strokeWidth={1.8} aria-hidden="true" />
                  Novo espaço
                </chakra.button>
              </Box>
            )}
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}
