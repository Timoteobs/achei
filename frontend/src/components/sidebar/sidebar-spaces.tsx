import { Box, Button, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  House,
  Plus,
  X,
} from "lucide-react";
import { useId, useState } from "react";
import { findLocationPath } from "./data";
import type { SidebarLocation, SidebarSelection, SidebarSpace } from "./types";

interface LocationItemProps {
  location: SidebarLocation;
  spaceId: string;
  selection?: SidebarSelection;
  onSelect: (selection: SidebarSelection) => void;
}

export function SidebarLocationItem({
  location,
  spaceId,
  selection,
  onSelect,
}: Readonly<LocationItemProps>) {
  const selected =
    selection?.spaceId === spaceId && selection.locationId === location.id;
  const containsSelection =
    selection?.spaceId === spaceId &&
    findLocationPath(location.children ?? [], selection.locationId).length > 0;
  const [expanded, setExpanded] = useState<boolean | undefined>();
  const open = expanded ?? containsSelection;
  const childrenId = useId();
  const Icon = location.icon ?? Folder;
  const hasChildren = !!location.children?.length;

  return (
    <Box as="li" listStyleType="none" minW="0">
      <Flex
        align="center"
        borderRadius="sm"
        bg={selected ? "brand.subtle" : "transparent"}
        color={selected ? "brand.fg" : "fg.muted"}
        _hover={{ bg: selected ? "brand.subtle" : "bg.subtle" }}
      >
        <Button
          variant="plain"
          flex="1"
          minW="0"
          h={{ base: "44px", md: "36px" }}
          px="3"
          gap="2.5"
          justifyContent="flex-start"
          color="inherit"
          fontSize="13px"
          fontWeight={selected ? "semibold" : "regular"}
          borderRadius="sm"
          aria-current={selected ? "location" : undefined}
          onClick={() => onSelect({ spaceId, locationId: location.id })}
          title={location.name}
        >
          <Icon
            size={16}
            strokeWidth={1.7}
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          />
          <Text as="span" truncate>
            {location.name}
          </Text>
        </Button>
        {hasChildren && (
          <IconButton
            variant="plain"
            size="xs"
            color="inherit"
            aria-label={`${open ? "Recolher" : "Expandir"} ${location.name}`}
            aria-expanded={open}
            aria-controls={childrenId}
            onClick={() => setExpanded(!open)}
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </IconButton>
        )}
      </Flex>
      {hasChildren && open && (
        <Box
          as="ul"
          id={childrenId}
          ms="3"
          ps="2"
          borderLeftWidth="1px"
          borderColor="border.default"
        >
          {location.children!.map((child) => (
            <SidebarLocationItem
              key={child.id}
              location={child}
              spaceId={spaceId}
              selection={selection}
              onSelect={onSelect}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export function SidebarSpaceItem({
  space,
  expanded,
  onToggle,
  selection,
  onSelect,
}: Readonly<{
  space: SidebarSpace;
  expanded: boolean;
  onToggle: () => void;
  selection?: SidebarSelection;
  onSelect: (selection: SidebarSelection) => void;
}>) {
  const childrenId = useId();
  const Icon = space.icon ?? House;
  const active = selection?.spaceId === space.id;
  return (
    <Box as="li" listStyleType="none">
      <Flex
        align="center"
        color={active ? "fg.default" : "fg.muted"}
        borderRadius="sm"
        _hover={{ bg: "bg.subtle" }}
      >
        <Button
          variant="plain"
          flex="1"
          minW="0"
          h="40px"
          px="3"
          gap="2.5"
          justifyContent="flex-start"
          color="inherit"
          fontWeight={active ? "semibold" : "medium"}
          fontSize="13px"
          borderRadius="sm"
          title={space.name}
          aria-current={
            active && !selection?.locationId ? "location" : undefined
          }
          onClick={() => onSelect({ spaceId: space.id })}
        >
          <Icon
            size={18}
            strokeWidth={1.7}
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          />
          <Text as="span" truncate>
            {space.name}
          </Text>
        </Button>
        <IconButton
          variant="plain"
          size="xs"
          me="1"
          color="fg.muted"
          aria-label={`${expanded ? "Recolher" : "Expandir"} ${space.name}`}
          aria-expanded={expanded}
          aria-controls={childrenId}
          onClick={onToggle}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </IconButton>
      </Flex>
      {expanded && (
        <Box
          as="ul"
          id={childrenId}
          ms="5"
          ps="2"
          mt="1"
          mb="2"
          borderLeftWidth="1px"
          borderColor="border.default"
        >
          {space.locations.length ? (
            space.locations.map((location) => (
              <SidebarLocationItem
                key={location.id}
                location={location}
                spaceId={space.id}
                selection={selection}
                onSelect={onSelect}
              />
            ))
          ) : (
            <Text
              as="li"
              listStyleType="none"
              color="fg.muted"
              fontSize="xs"
              px="3"
              py="2"
            >
              Nenhum local ainda
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}

export function SidebarSpaces({
  spaces,
  selection,
  expandedSpaces,
  onToggleSpace,
  onSelect,
  onCreateSpace,
}: Readonly<{
  spaces: SidebarSpace[];
  selection?: SidebarSelection;
  expandedSpaces: Set<string>;
  onToggleSpace: (id: string) => void;
  onSelect: (selection: SidebarSelection) => void;
  onCreateSpace: (name: string) => void;
}>) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const titleId = useId();
  return (
    <Flex
      as="section"
      aria-labelledby={titleId}
      direction="column"
      flex="1"
      minH="200px"
      borderTopWidth="1px"
      borderColor="border.default"
      mx="3"
      pt="5"
    >
      <Text
        id={titleId}
        as="h2"
        color="fg.muted"
        fontSize="10px"
        fontWeight="semibold"
        letterSpacing="1.4px"
        px="3"
        mb="3"
      >
        MEUS ESPAÇOS
      </Text>
      <Box
        overflowY="auto"
        overscrollBehavior="contain"
        flex="1"
        minH="0"
        pb="4"
      >
        <Box as="ul" display="flex" flexDirection="column" gap="1">
          {spaces.map((space) => (
            <SidebarSpaceItem
              key={space.id}
              space={space}
              expanded={expandedSpaces.has(space.id)}
              onToggle={() => onToggleSpace(space.id)}
              selection={selection}
              onSelect={onSelect}
            />
          ))}
        </Box>
        {creating ? (
          <Box
            as="form"
            mt="3"
            px="2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) return;
              onCreateSpace(name.trim());
              setName("");
              setCreating(false);
            }}
          >
            <Flex align="center" gap="1">
              <Input
                autoFocus
                aria-label="Nome do novo espaço"
                placeholder="Nome do espaço"
                value={name}
                maxLength={80}
                size="sm"
                borderRadius="sm"
                bg="bg.surface"
                borderColor="border.default"
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.stopPropagation();
                    setCreating(false);
                    setName("");
                  }
                }}
              />
              <IconButton
                type="button"
                variant="ghost"
                size="xs"
                aria-label="Cancelar novo espaço"
                onClick={() => {
                  setCreating(false);
                  setName("");
                }}
              >
                <X size={15} />
              </IconButton>
            </Flex>
            <Button
              type="submit"
              mt="2"
              size="xs"
              w="full"
              disabled={!name.trim()}
              bg="brand.solid"
              color="brand.contrast"
              borderRadius="sm"
            >
              Criar espaço
            </Button>
          </Box>
        ) : (
          <Button
            onClick={() => setCreating(true)}
            variant="plain"
            w="full"
            justifyContent="flex-start"
            gap="2.5"
            px="3"
            mt="2"
            h="40px"
            fontSize="13px"
            fontWeight="medium"
            borderRadius="sm"
            color="brand.fg"
            _hover={{ bg: "brand.subtle" }}
          >
            <Plus size={18} strokeWidth={1.7} />
            Novo espaço
          </Button>
        )}
      </Box>
    </Flex>
  );
}
