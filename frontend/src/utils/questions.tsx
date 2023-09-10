import { type ColumnDef, type ColumnHelper } from '@tanstack/react-table';
import { type QuestionData } from '../types/questions/questions';
import { Stack, Tag } from '@chakra-ui/react';
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
      enableSorting: true,
      header: 'Question ID',
    }),
    columnHelper.accessor('title', {
      cell: (title): string => title.getValue(),
      enableSorting: true,
      header: 'Question Title',
    }),
    columnHelper.accessor('categories', {
      header: 'Question Categories',
      enableSorting: true,
      cell: (categories) => (
        <Stack direction="row">
          {categories.getValue().map((category) => (
            <Tag key={category}>{category}</Tag>
          ))}
        </Stack>
      ),
    }),
    columnHelper.accessor('complexity', {
      header: 'Question Complexity',
      enableSorting: true,
      cell: (complexity) => <QuestionComplexityTag questionComplexity={complexity.getValue()} />,
    }),
    columnHelper.accessor('action', {
      header: '',
      enableSorting: false,
      cell: (cell) => (
        <QuestionViewIconButton questionId={cell.row.original.questionID} title={cell.row.original.title} />
      ),
    }),
  ] as Array<ColumnDef<QuestionDataRowData>>;
};
