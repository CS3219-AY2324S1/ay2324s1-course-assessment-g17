import { Card, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  type Column,
  type ColumnDef,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import DataTablePagination from './DataTablePagination';
import DataTableHeader from './DataTableHeader';
import DataTableSearch from './DataTableSearch';

interface DataTableProps<T extends object> {
  /* The data collection to be displayed by the table */
  tableData: T[];
  /* The columns to be displayed by the table */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Array<ColumnDef<T, any>>;
  /* Whether the DataTable should be sortable or not, sorting is enabled for
    all columns by default. To only enable sorting for some columns, set isSortable
    to true and toggle the enableSorting attribute in the column def. */
  isSortable?: boolean;
  /* Whether the DataTable should be searchable or not, enabled by default */
  isSearchable?: boolean;
  /* Determines which columns can be filtered */
  getColumnCanGlobalFilter?: (column: Column<T>) => boolean;
  /* Whether the DataTable should be paginated or not, enabled by default */
  isPaginated?: boolean;
}

const DataTable = <T extends object>({
  tableData,
  columns,
  isSortable = true,
  isSearchable = true,
  getColumnCanGlobalFilter,
  isPaginated = true,
}: DataTableProps<T>): JSX.Element => {
  const [sortBy, setSortBy] = useState<SortingState>([]);
  const table = useReactTable<T>({
    data: tableData,
    columns,
    state: {
      sorting: isSortable ? sortBy : undefined,
    },
    autoResetPageIndex: true,
    getCoreRowModel: getCoreRowModel(),
    ...(isSortable && {
      onSortingChange: setSortBy,
      getSortedRowModel: getSortedRowModel(),
    }),
    ...(isSearchable && { getFilteredRowModel: getFilteredRowModel() }),
    ...(getColumnCanGlobalFilter !== undefined && { getColumnCanGlobalFilter }),
    ...(isPaginated && { getPaginationRowModel: getPaginationRowModel() }),
  });

  return (
    <>
      {isSortable && <DataTableSearch table={table} />}
      <Card variant="outline">
        <Table size="sm">
          <DataTableHeader headerGroups={table.getHeaderGroups()} isSortable={isSortable} />
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                ))}
              </Tr>
            ))}
            {table.getPrePaginationRowModel().rows.length === 0 && (
              <Tr>
                <Td textAlign="center" colSpan={table.getAllColumns().length} paddingY={8}>
                  <Text color="gray.500">No questions found</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        {isPaginated && <DataTablePagination table={table} />}
      </Card>
    </>
  );
};

export default DataTable;
