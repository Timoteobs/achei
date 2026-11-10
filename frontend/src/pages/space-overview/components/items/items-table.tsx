import { Box, Flex, Text } from "@chakra-ui/react";
import { Package } from "lucide-react";
import { DataTable } from "../../../../components/data-table/data-table";
import type { DataTableColumn } from "../../../../components/data-table/data-table";
import { Pagination } from "../../../../components/pagination/pagination";
import type { ItemResponse, ItemsPageResponse } from "../../../../services/items";
import { ItemActionsMenu } from "./item-actions-menu";
import { formatDate } from "../../../../utils/date";

const columns: DataTableColumn<ItemResponse>[] = [
  {
    id: "item",
    header: "Item",
    isPrimary: true,
    cell: (item) => (
      <Flex align="center" gap="3" minW="0">
        <Flex boxSize="11" flexShrink="0" align="center" justify="center"
          bg="bg.subtle" color="fg.muted" borderRadius="sm" aria-hidden="true">
          <Package size={20} strokeWidth={1.8} />
        </Flex>
        <Box minW="0">
          <Text color="fg.default" fontSize="sm" fontWeight="semibold" truncate>{item.name}</Text>
          {item.description && <Text color="fg.muted" fontSize="sm" truncate>{item.description}</Text>}
        </Box>
      </Flex>
    ),
  },
  {
    id: "quantity",
    header: "Quantidade",
    cell: (item) => <Text color="fg.muted" fontSize="sm">{item.quantity} {item.quantity === 1 ? "unidade" : "unidades"}</Text>,
  },
  {
    id: "createdAt",
    header: "Data de adição",
    cell: (item) => <Text color="fg.muted" fontSize="sm">{formatDate(item.createdAt)}</Text>,
  },
  {
    id: "notes",
    header: "Observações",
    hideBelow: "lg",
    cell: (item) => <Text color="fg.muted" fontSize="sm" overflowWrap="anywhere">{item.notes || "—"}</Text>,
  },
];

export function ItemsTable({ data, onPageChange, onDelete, onEdit, onMove }: Readonly<{
  data: ItemsPageResponse;
  onPageChange: (page: number) => void;
  onDelete: (item: ItemResponse) => void;
  onEdit: (item: ItemResponse) => void;
  onMove: (item: ItemResponse) => void;
}>) {
  const tableColumns: DataTableColumn<ItemResponse>[] = [
    ...columns,
    {
      id: "actions",
      kind: "action",
      align: "end",
      header: "Ações",
      cell: (item) => <ItemActionsMenu onMove={() => onMove(item)} onEdit={() => onEdit(item)} name={item.name} onDelete={() => onDelete(item)} />,
    },
  ];
  const first = (data.page - 1) * data.pageSize + 1;
  const last = first + data.items.length - 1;
  return (
    <Box>
      <DataTable data={data.items} columns={tableColumns} getRowId={(item) => String(item.id)} />
      <Flex align="center" justify="space-between" flexWrap="wrap" gap="3" mt="4">
        <Text color="fg.muted" fontSize="sm">Mostrando {first}–{last} de {data.totalCount} itens</Text>
        <Pagination count={data.totalCount} pageSize={data.pageSize} page={data.page} onPageChange={onPageChange} />
      </Flex>
    </Box>
  );
}