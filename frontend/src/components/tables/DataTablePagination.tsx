import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@chakra-ui/icons';
import {
  Flex,
  Tooltip,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Text,
} from '@chakra-ui/react';
import { type Table } from '@tanstack/react-table';
import React from 'react';

interface DataTablePaginationProps<T> {
  table: Table<T>;
}

const numEntriesPerPageOptions = [5, 10, 20, 30, 40, 50];

const DataTablePagination = <T extends object>({ table }: DataTablePaginationProps<T>): JSX.Element => {
  const {
    getPageCount,
    getCanPreviousPage,
    getCanNextPage,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
    getState,
  } = table;
  const { pageIndex, pageSize } = getState().pagination;
  return (
    <Flex justifyContent="space-between" alignItems="center" borderTopWidth="1px" padding={4}>
      <Flex>
        {/* Jump to first page icon button */}
        <Tooltip label="First Page">
          <IconButton
            aria-label="First Page"
            onClick={() => {
              setPageIndex(0);
            }}
            isDisabled={!getCanPreviousPage()}
            icon={<ArrowLeftIcon height={3} width={3} />}
            mr={4}
          />
        </Tooltip>

        {/* Navigate to previous page icon button */}
        <Tooltip label="Previous Page">
          <IconButton
            aria-label="Previous Page"
            onClick={previousPage}
            isDisabled={!getCanPreviousPage()}
            icon={<ChevronLeftIcon height={6} width={6} />}
          />
        </Tooltip>
      </Flex>

      <Flex alignItems="center">
        {/* Current page number display */}
        <Text fontSize="sm" flexShrink="0" marginRight={8}>
          {'Page '}
          <Text fontSize="sm" fontWeight="bold" as="span">
            {`${pageIndex + 1} of ${Math.max(getPageCount(), 1)}`}
          </Text>
          <Text fontSize="sm" as="span">
            {` (${table.getPrePaginationRowModel().rows.length} entries)`}
          </Text>
        </Text>

        {/* Page Navigation Field Input */}
        <Text fontSize="sm" flexShrink="0">
          {'Go to page: '}
        </Text>
        <NumberInput
          size="sm"
          marginLeft={2}
          marginRight={8}
          width={20}
          min={1}
          max={Math.max(getPageCount(), 1)}
          onChange={(_str, num) => {
            if (_str !== '') setPageIndex(Math.max(num - 1, 0));
          }}
          value={pageIndex + 1}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        {/* Toggle number of entries per page */}
        <Select
          size="sm"
          width={28}
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
            aria-label="Next Page"
            onClick={nextPage}
            isDisabled={!getCanNextPage()}
            icon={<ChevronRightIcon height={6} width={6} />}
          />
        </Tooltip>
        <Tooltip label="Last Page">
          <IconButton
            aria-label="Last Page"
            onClick={() => {
              setPageIndex(getPageCount() - 1);
            }}
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
