import { type ColumnDef, type ColumnHelper } from '@tanstack/react-table';
import { type QuestionData } from '../types/questions/questions';
import { Stack, Tag, Wrap, WrapItem } from '@chakra-ui/react';
import QuestionComplexityTag from '../components/questions/QuestionComplexityTag';
import QuestionViewIconButton from '../components/questions/QuestionViewIconButton';
import React from 'react';

export interface QuestionDataRowData extends QuestionData {
  action?: undefined;
}

export const QuestionsTableColumns = (
  columnHelper: ColumnHelper<QuestionDataRowData>,
): Array<ColumnDef<QuestionDataRowData>> => {
  return [
    columnHelper.accessor('questionID', {
      cell: (id): number => id.getValue(),
      header: 'ID',
    }),
    columnHelper.accessor('title', {
      cell: (title): string => title.getValue(),
      header: 'Title',
    }),
    columnHelper.accessor('categories', {
      header: 'Categories',
      enableColumnFilter: true,
      cell: (categories) => (
        <Stack direction="row" spacing={4}>
          <Wrap>
            {categories.getValue().map((category) => (
              <WrapItem key={category}>
                <Tag>{category}</Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Stack>
      ),
    }),
    columnHelper.accessor('complexity', {
      header: 'Complexity',
      cell: (complexity) => <QuestionComplexityTag questionComplexity={complexity.getValue()} />,
    }),
    columnHelper.accessor('action', {
      header: '',
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (cell) => (
        <QuestionViewIconButton questionId={cell.row.original.questionID} title={cell.row.original.title} />
      ),
    }),
  ] as Array<ColumnDef<QuestionDataRowData>>;
};
