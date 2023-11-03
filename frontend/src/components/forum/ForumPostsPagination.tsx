import React from 'react';
import { Flex, Tooltip, IconButton, Text } from '@chakra-ui/react';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@chakra-ui/icons';
import CustomNumberInput from './CustomNumberInput';

interface ForumPostsPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const ForumPostsPagination: React.FC<ForumPostsPaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: ForumPostsPaginationProps) => {
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

  const pluralForm = totalItems <= 1 ? 'post' : 'posts';

  return (
    <Flex justifyContent="space-between" alignItems="center" borderTopWidth="1px" padding={4}>
      <Flex>
        <Tooltip label="First Page">
          <IconButton
            aria-label="First Page"
            onClick={() => {
              onPageChange(1);
            }}
            isDisabled={currentPage === 1}
            icon={<ArrowLeftIcon height={3} width={3} />}
            mr={4}
          />
        </Tooltip>
        <Tooltip label="Previous Page">
          <IconButton
            aria-label="Previous Page"
            onClick={() => {
              onPageChange(currentPage - 1);
            }}
            isDisabled={currentPage === 1}
            icon={<ChevronLeftIcon height={6} width={6} />}
            mr={4}
          />
        </Tooltip>
      </Flex>
      <Flex alignItems="center">
        {/* Current page number display */}
        <Text fontSize="sm" flexShrink="0" mr={8}>
          {'Page '}
          <Text fontSize="sm" fontWeight="bold" as="span">
            {`${currentPage} of ${totalPages}`}
          </Text>
          <Text fontSize="sm" as="span">
            {` (${totalItems} ${pluralForm})`}
          </Text>
        </Text>
        {/* Page Navigation Field Input */}
        <Text fontSize="sm" flexShrink={0}>
          {'Go to page: '}
        </Text>
        <CustomNumberInput
          value={currentPage}
          onChange={(newPage) => {
            onPageChange(newPage);
          }}
          min={1}
          max={totalPages}
        />
      </Flex>
      <Flex>
        <Tooltip label="Next Page">
          <IconButton
            aria-label="Next Page"
            onClick={() => {
              onPageChange(currentPage + 1);
            }}
            isDisabled={currentPage === totalPages}
            icon={<ChevronRightIcon height={6} width={6} />}
            ml={4}
          />
        </Tooltip>
        <Tooltip label="Last Page">
          <IconButton
            aria-label="Last Page"
            onClick={() => {
              onPageChange(totalPages);
            }}
            isDisabled={currentPage === totalPages}
            icon={<ArrowRightIcon height={3} width={3} />}
            ml={4}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default ForumPostsPagination;
