import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement, InputRightElement, useColorModeValue } from '@chakra-ui/react';
import { type Table } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

const SEARCH_DEBOUNCE_DELAY = 200;

interface DataTableSearchProps<T> {
  table: Table<T>;
}

const DataTableSearch = <T extends object>({ table }: DataTableSearchProps<T>): JSX.Element => {
  const globalFilter = table.getState().globalFilter as string | undefined;
  const [searchValue, setSearchValue] = useState(globalFilter);

  useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(searchValue);
    }, SEARCH_DEBOUNCE_DELAY);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchValue]);

  return (
    <InputGroup minWidth="fit-content">
      <InputLeftElement paddingLeft={8} pointerEvents="none">
        <SearchIcon color="gray.400" />
      </InputLeftElement>

      <Input
        paddingLeft={16}
        type="text"
        placeholder="Search Question List"
        _placeholder={{ color: useColorModeValue('gray.500', 'gray.400'), opacity: 1 }}
        value={searchValue ?? ''}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />

      <InputRightElement
        _hover={{ cursor: 'pointer', color: 'gray.600' }} // Change color on hover
        color="gray.400"
        _active={{ transform: 'scale(0.9)' }} // Scale down on click
        onClick={() => {
          setSearchValue('');
        }}
      >
        <CloseIcon />
      </InputRightElement>
    </InputGroup>
  );
};

export default DataTableSearch;
