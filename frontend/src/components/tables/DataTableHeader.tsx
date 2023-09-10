import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Stack, Text, Th, Thead, Tr, chakra, useColorModeValue } from '@chakra-ui/react';
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
              <Th
                key={header.id}
                backgroundColor={useColorModeValue('gray.200', 'gray.700')}
                {...(isSortable && { onClick: header.column.getToggleSortingHandler() })}
                paddingY={4}
              >
                <Stack direction="row" alignItems="center">
                  <Text fontWeight="bold" fontSize={13}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Text>
                  <chakra.span minHeight={5}>
                    {sortDirection === 'asc' && <ChevronUpIcon boxSize={5} />}
                    {sortDirection === 'desc' && <ChevronDownIcon boxSize={5} />}
                  </chakra.span>
                </Stack>
              </Th>
            );
          })}
        </Tr>
      ))}
    </Thead>
  );
};

export default DataTableHeader;
