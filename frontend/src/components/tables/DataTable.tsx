import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { Table, Tbody, Td, Th, Thead, Tr, chakra } from '@chakra-ui/react';
import { useReactTable, getCoreRowModel, getSortedRowModel, type SortingState, type ColumnDef, flexRender } from '@tanstack/react-table';
import React, { useState } from 'react';
import DataTablePagination from './DataTablePagination';
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
    <>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {
                headerGroup.headers.map((header) => {
                  const sortDirection = header.column.getIsSorted();
                  return (
                  <Th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    }
                    <chakra.span paddingLeft={2}>
                      {sortDirection === 'asc' && <ArrowUpIcon />}
                      {sortDirection === 'desc' && <ArrowDownIcon />}
                    </chakra.span>
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
      <DataTablePagination table={table} />
    </>
  );
};

export default DataTable;
