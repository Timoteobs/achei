import { Box, Flex, Stack, Table } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type DataTableColumnKind = "selection" | "action" | "data";

export interface DataTableColumn<T> {
  id: string;
  header?: ReactNode;
  cell: (row: T) => ReactNode;
  kind?: DataTableColumnKind;
  isPrimary?: boolean;
  hideBelow?: "md" | "lg";
  width?: string;
  align?: "start" | "center" | "end";
}

export interface DataTableProps<T> {
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowId: (row: T) => string;
  emptyMessage?: string;
}

function columnDisplay(hideBelow: DataTableColumn<unknown>["hideBelow"]) {
  return hideBelow ? { base: "none", [hideBelow]: "table-cell" } : undefined;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  emptyMessage = "Nenhum item encontrado.",
}: Readonly<DataTableProps<T>>) {
  const primaryColumn = columns.find((column) => column.isPrimary);
  const selectionColumn = columns.find(
    (column) => column.kind === "selection",
  );
  const actionColumn = columns.find((column) => column.kind === "action");
  const metaColumns = columns.filter(
    (column) => column !== primaryColumn && column.kind !== "selection",
  );

  return (
    <>
      <Box
        display={{ base: "none", md: "block" }}
        bg="bg.surface"
        borderWidth="1px"
        borderColor="border.default"
        borderRadius="md"
        overflow="hidden"
      >
        <Table.Root>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              {columns.map((column) => (
                <Table.ColumnHeader
                  key={column.id}
                  display={columnDisplay(column.hideBelow)}
                  textAlign={column.align}
                  w={column.width}
                  color="fg.muted"
                  fontSize="xs"
                  fontWeight="semibold"
                  textTransform="none"
                  borderColor="border.default"
                >
                  {column.header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={columns.length}
                  textAlign="center"
                  py="8"
                  color="fg.muted"
                  fontSize="sm"
                >
                  {emptyMessage}
                </Table.Cell>
              </Table.Row>
            ) : (
              data.map((row) => (
                <Table.Row key={getRowId(row)} _hover={{ bg: "bg.subtle" }}>
                  {columns.map((column) => (
                    <Table.Cell
                      key={column.id}
                      display={columnDisplay(column.hideBelow)}
                      textAlign={column.align}
                      borderColor="border.default"
                      py="3"
                    >
                      {column.cell(row)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      <Stack
        display={{ base: "flex", md: "none" }}
        gap="0"
        bg="bg.surface"
        borderWidth="1px"
        borderColor="border.default"
        borderRadius="md"
        overflow="hidden"
      >
        {data.length === 0 ? (
          <Box p="6" textAlign="center" color="fg.muted" fontSize="sm">
            {emptyMessage}
          </Box>
        ) : (
          data.map((row, index) => (
            <Flex
              key={getRowId(row)}
              direction="column"
              gap="2"
              p="4"
              borderBottomWidth={index < data.length - 1 ? "1px" : "0"}
              borderColor="border.default"
            >
              <Flex align="start" justify="space-between" gap="3">
                <Flex align="start" gap="3" minW="0" flex="1">
                  {selectionColumn && (
                    <Box flexShrink="0">{selectionColumn.cell(row)}</Box>
                  )}
                  {primaryColumn && (
                    <Box minW="0" flex="1">
                      {primaryColumn.cell(row)}
                    </Box>
                  )}
                </Flex>
                {actionColumn && (
                  <Box flexShrink="0">{actionColumn.cell(row)}</Box>
                )}
              </Flex>
              {metaColumns.length > 0 && (
                <Flex wrap="wrap" align="center" gap="3" ps="8">
                  {metaColumns.map((column) => (
                    <Box key={column.id}>{column.cell(row)}</Box>
                  ))}
                </Flex>
              )}
            </Flex>
          ))
        )}
      </Stack>
    </>
  );
}
