import { Box, Flex, Popover, Portal, Spinner, Stack, Text, chakra } from "@chakra-ui/react";
import { Check, ChevronDown, Layers, Plus, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { Ref } from "react";
import { Input } from "../input/input";

export interface SearchSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export interface SearchSelectProps {
  options: readonly SearchSelectOption[];
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  icon?: LucideIcon;
  value?: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  createAction?: { label: string; onClick: () => void };
  loading?: boolean;
  disabled?: boolean;
  portalled?: boolean;
  size?: "md" | "lg";
  triggerRef?: Ref<HTMLButtonElement>;
  invalid?: boolean;
  describedBy?: string;
}

export function SearchSelect({
  options, label, placeholder = "Selecione uma opção", searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhuma opção disponível.", icon: DefaultIcon = Layers,
  value, onValueChange, onBlur, createAction, loading = false, disabled = false,
  portalled = true, size = "md", triggerRef, invalid, describedBy,
}: Readonly<SearchSelectProps>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pendingCreate, setPendingCreate] = useState<(() => void) | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const SelectedIcon = selectedOption?.icon ?? DefaultIcon;
  const normalizedSearch = normalizeSearch(search);
  const filteredOptions = options.filter((option) => normalizeSearch(option.label).includes(normalizedSearch));

  const close = () => {
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover.Root
      open={open}
      restoreFocus={!pendingCreate}
      onExitComplete={() => {
        if (!pendingCreate) return;
        setPendingCreate(null);
        pendingCreate();
      }}
      onOpenChange={({ open: nextOpen }) => {
        setOpen(nextOpen);
        if (!nextOpen) setSearch("");
      }}
      portalled={portalled}
      positioning={{ placement: "bottom-start", sameWidth: true, gutter: 8, strategy: portalled ? "absolute" : "fixed", hideWhenDetached: true }}
      initialFocusEl={() => searchRef.current}
      lazyMount
      unmountOnExit
    >
      <Popover.Trigger asChild>
        <chakra.button
          type="button"
          ref={triggerRef}
          onBlur={onBlur}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          disabled={disabled || loading}
          aria-label={`${label}: ${loading ? "Carregando..." : selectedOption?.label ?? placeholder}`}
          display="flex"
          alignItems="center"
          gap="3"
          w="full"
          minH={size === "lg" ? "68px" : "52px"}
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
          _invalid={{ borderColor: "danger.500" }}
        >
          <Flex boxSize={size === "lg" ? "11" : "9"} flexShrink="0" align="center" justify="center" bg="brand.muted" color="brand.fg" borderRadius="md" aria-hidden="true">
            {loading ? <Spinner size="sm" /> : <SelectedIcon size={21} strokeWidth={1.8} />}
          </Flex>
          <Box flex="1" minW="0">
            <Text fontSize={size === "lg" ? "sm" : "xs"} color="fg.muted" lineHeight="short">{label}</Text>
            <Text fontSize={size === "lg" ? "md" : "sm"} fontWeight="semibold" truncate>
              {loading ? "Carregando..." : selectedOption?.label ?? placeholder}
            </Text>
          </Box>
          <ChevronDown size={18} strokeWidth={1.8} aria-hidden="true" />
        </chakra.button>
      </Popover.Trigger>
      <Portal disabled={!portalled}>
        <Popover.Positioner>
          <Popover.Content
            aria-label={label}
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
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                startElement={<Search size={16} strokeWidth={1.8} />}
                h="9"
                fontSize="sm"
              />
            </Box>
            <Stack gap="1" maxH="64" overflowY="auto" role="group" aria-label={`Opções de ${label}`}>
              {filteredOptions.map((option) => {
                const selected = option.value === value;
                const Icon = option.icon ?? DefaultIcon;
                return (
                  <chakra.button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => { onValueChange(option.value); close(); }}
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
                      <Text fontSize="sm" fontWeight="semibold" color="fg.default" overflowWrap="anywhere">{option.label}</Text>
                      {option.description && <Text fontSize="xs" color="fg.muted" overflowWrap="anywhere">{option.description}</Text>}
                    </Box>
                    {selected && <Box color="brand.fg" flexShrink="0" aria-hidden="true"><Check size={19} strokeWidth={2.2} /></Box>}
                  </chakra.button>
                );
              })}
              {filteredOptions.length === 0 && (
                <Text role="status" fontSize="sm" color="fg.muted" px="3" py="4">
                  {options.length === 0 ? emptyMessage : "Nenhum resultado encontrado."}
                </Text>
              )}
            </Stack>
            {createAction && (
              <Box borderTopWidth="1px" borderColor="border.default" mt="2" pt="1">
                <chakra.button
                  type="button"
                  onClick={() => {
                    // Let the popover release focus before opening another dialog.
                    setPendingCreate(() => createAction.onClick);
                    close();
                  }}
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
                  {createAction.label}
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
