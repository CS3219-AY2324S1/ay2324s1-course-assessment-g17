import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useReactTable, getCoreRowModel, getSortedRowModel, type SortingState, type ColumnDef, flexRender } from '@tanstack/react-table';
import React, { useState } from 'react';
interface DataTableProps<T extends object> {
  tableData: T[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Array<ColumnDef<T, any>>
}

const DataTable = <T extends object>({ tableData, columns }: DataTableProps<T>): JSX.Element => {
  const [sortBy, setSortBy] = useState<SortingState>([]);
  const table = useReactTable<T>({
    data: tableData,
    columns,
    state: {
      sorting: sortBy
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSortBy,
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {
              headerGroup.headers.map((header) => {
                const sortDirection = header.column.getIsSorted();
                return (
                <Th key={header.id} onClick={header.column.getToggleSortingHandler}>
                  {
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  }
                  <Box paddingLeft={2}>
                    {sortDirection === 'asc' && <ArrowUpIcon />}
                    {sortDirection === 'desc' && <ArrowDownIcon />}
                  </Box>
                </Th>
                );
              })
            }
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default DataTable;
