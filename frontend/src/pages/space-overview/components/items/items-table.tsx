import { Badge, Box, Checkbox, Flex, IconButton, Text } from "@chakra-ui/react";
import { MoreVertical, Package } from "lucide-react";
import { colorVariantStyles } from "../../../../components/color-variants";
import { DataTable } from "../../../../components/data-table/data-table";
import type { DataTableColumn } from "../../../../components/data-table/data-table";
import { Pagination } from "../../../../components/pagination/pagination";
import { itemsMock, itemsTotalCount } from "./items-mock";
import type { Item } from "./items-mock";
import { ItemStatusBadge } from "./item-status-badge";

function ItemRowCheckbox({ label }: Readonly<{ label: string }>) {
  return (
    <Checkbox.Root colorPalette="brand" size="sm">
      <Checkbox.HiddenInput aria-label={label} />
      <Checkbox.Control
        borderColor="border.emphasized"
        borderRadius="xs"
        _checked={{
          bg: "brand.solid",
          borderColor: "brand.solid",
          color: "brand.contrast",
        }}
      >
        <Checkbox.Indicator />
      </Checkbox.Control>
    </Checkbox.Root>
  );
}

const columns: DataTableColumn<Item>[] = [
  {
    id: "select",
    kind: "selection",
    width: "1%",
    header: <ItemRowCheckbox label="Selecionar todos os itens" />,
    cell: (item) => <ItemRowCheckbox label={`Selecionar ${item.name}`} />,
  },
  {
    id: "item",
    header: "Item",
    isPrimary: true,
    cell: (item) => (
      <Flex align="center" gap="3" minW="0">
        <Flex
          boxSize="11"
          flexShrink="0"
          align="center"
          justify="center"
          bg="bg.subtle"
          color="fg.muted"
          borderRadius="sm"
          aria-hidden="true"
        >
          <Package size={20} strokeWidth={1.8} />
        </Flex>
        <Box minW="0">
          <Text
            color="fg.default"
            fontSize="sm"
            fontWeight="semibold"
            truncate
          >
            {item.name}
          </Text>
          <Text color="fg.muted" fontSize="sm" truncate>
            {item.description}
          </Text>
        </Box>
      </Flex>
    ),
  },
  {
    id: "category",
    header: "Categoria",
    cell: (item) => (
      <Badge
        {...colorVariantStyles[item.categoryVariant]}
        borderRadius="full"
        px="2.5"
        py="0.5"
        fontSize="xs"
        fontWeight="medium"
      >
        {item.category}
      </Badge>
    ),
  },
  {
    id: "createdAt",
    header: "Data de adição",
    hideBelow: "lg",
    cell: (item) => (
      <Text color="fg.muted" fontSize="sm">
        {item.createdAt}
      </Text>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (item) => <ItemStatusBadge status={item.status} />,
  },
  {
    id: "actions",
    kind: "action",
    align: "end",
    cell: (item) => (
      <IconButton
        aria-label={`Mais opções de ${item.name}`}
        variant="ghost"
        size="xs"
        color="fg.muted"
        _hover={{ bg: "bg.subtle" }}
      >
        <MoreVertical size={16} strokeWidth={1.8} />
      </IconButton>
    ),
  },
];

export function ItemsTable() {
  const visibleCount = itemsMock.length;

  return (
    <Box>
      <DataTable
        data={itemsMock}
        columns={columns}
        getRowId={(item) => item.id}
      />
      <Flex align="center" justify="space-between" flexWrap="wrap" gap="3" mt="4">
        <Text color="fg.muted" fontSize="sm">
          Mostrando {visibleCount} de {itemsTotalCount} itens
        </Text>
        <Pagination
          count={itemsTotalCount}
          pageSize={visibleCount}
          defaultPage={1}
        />
      </Flex>
    </Box>
  );
}
