import { type ColumnDef, type ColumnHelper } from '@tanstack/react-table';
import { type QuestionData } from '../types/questions/questions';
import { Stack, Tag } from '@chakra-ui/react';
import QuestionComplexityTag from '../components/questions/QuestionComplexityTag';
import QuestionViewIconButton from '../components/questions/QuestionViewIconButton';
import React from 'react';

export const QuestionsTableColumns = (columnHelper: ColumnHelper<QuestionData>): Array<ColumnDef<QuestionData>> => {
  return [
    columnHelper.accessor('questionID', {
      cell: (id): number => id.getValue(),
      header: 'Question ID',
    }),
    columnHelper.accessor('title', {
      cell: (title): string => title.getValue(),
      header: 'Question Title',
    }),
    columnHelper.accessor('categories', {
      header: 'Question Categories',
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
      cell: (complexity) => <QuestionComplexityTag questionComplexity={complexity.getValue()} />,
    }),
    columnHelper.accessor('questionID', {
      header: '',
      cell: (cell) => <QuestionViewIconButton questionId={cell.getValue()} />,
    }),
  ] as Array<ColumnDef<QuestionData>>;
};
