import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Flex, Tooltip, IconButton, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Text } from '@chakra-ui/react';
import { type Table } from '@tanstack/react-table';
import React from 'react';

interface DataTablePaginationProps<T> {
  table: Table<T>
}

const numEntriesPerPageOptions = [10, 20, 30, 40, 50];

const DataTablePagination = <T extends object>({ table }: DataTablePaginationProps<T>): JSX.Element => {
  const {
    getPageCount,
    getCanPreviousPage,
    getCanNextPage,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
    getState
  } = table;
  const { pageIndex, pageSize } = getState().pagination;
  return (
    <Flex justifyContent="space-between" margin={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              aria-label="First Page"
              onClick={() => { setPageIndex(0); }}
              isDisabled={!getCanPreviousPage()}
              icon={<ArrowLeftIcon height={3} width={3} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              aria-label="Previous Page"
              onClick={previousPage}
              isDisabled={!getCanNextPage()}
              icon={<ChevronLeftIcon height={6} width={6} />}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink="0" marginRight={8}>
            Page{' '}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{' '}
            of{' '}
            <Text fontWeight="bold" as="span">
              {getPageCount()}
            </Text>
          </Text>
          <Text flexShrink="0">Go to page:</Text>{' '}
          <NumberInput
            marginLeft={2}
            marginRight={8}
            width={28}
            min={1}
            max={getPageCount()}
            onChange={(_str, num) => {
              setPageIndex(Math.min(num - 1, 0));
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            width={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {numEntriesPerPageOptions.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              aria-label='Next Page'
              onClick={nextPage}
              isDisabled={!getCanNextPage()}
              icon={<ChevronRightIcon height={6} width={6} />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              aria-label='Last Page'
              onClick={() => { setPageIndex(getPageCount() - 1); }}
              isDisabled={!getCanNextPage()}
              icon={<ArrowRightIcon height={3} width={3} />}
              marginLeft={4}
            />
          </Tooltip>
        </Flex>
      </Flex>
  );
};

export default DataTablePagination;
