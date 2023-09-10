import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { Th, Thead, Tr, chakra } from '@chakra-ui/react';
import { type HeaderGroup } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import React from 'react';

interface DataTableHeaderProps<T> {
  headerGroups: Array<HeaderGroup<T>>;
  isSortable: boolean;
}

const DataTableHeader = <T extends object>({ headerGroups, isSortable }: DataTableHeaderProps<T>): JSX.Element => {
  return (
    <Thead>
      {headerGroups.map((headerGroup) => (
        <Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const sortDirection = header.column.getIsSorted();
            return (
              <Th key={header.id} {...(isSortable && { onClick: header.column.getToggleSortingHandler() })}>
                {flexRender(header.column.columnDef.header, header.getContext())}
                <chakra.span paddingLeft={2}>
                  {sortDirection === 'asc' && <ArrowUpIcon />}
                  {sortDirection === 'desc' && <ArrowDownIcon />}
                </chakra.span>
              </Th>
            );
          })}
        </Tr>
      ))}
    </Thead>
  );
};

export default DataTableHeader;
