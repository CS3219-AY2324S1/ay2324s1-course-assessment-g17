import { type ColumnDef, type ColumnHelper } from '@tanstack/react-table';
import { QuestionComplexityEnum, type QuestionData } from '../types/questions/questions';
import { Stack, Tag, Wrap, WrapItem } from '@chakra-ui/react';
import QuestionComplexityTag from '../components/questions/QuestionComplexityTag';
import QuestionViewIconButton from '../components/questions/QuestionViewIconButton';
import QuestionDeleteIconButton from '../components/questions/QuestionDeleteIconButton';
import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../api/questions/questions';

export interface QuestionDataRowData extends QuestionData {
  action?: undefined;
}

export const QuestionsTableColumns = (
  columnHelper: ColumnHelper<QuestionDataRowData>,
): Array<ColumnDef<QuestionDataRowData>> => {
  const [categories, setAllCategories] = useState<string[]>([]);
  useEffect(() => {
    new QuestionsAPI()
      .getCategories()
      .then((categories) => {
        setAllCategories(categories);
      })
      .catch(console.error);
  }, []);

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
      meta: {
        selectFilterOptions: categories,
        selectOptionPrefix: 'Category',
      },
      header: 'Categories',
      filterFn: 'arrIncludes',
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
      meta: {
        selectFilterOptions: Object.values(QuestionComplexityEnum),
        selectOptionPrefix: 'Complexity',
      },
      header: 'Complexity',
      cell: (complexity) => <QuestionComplexityTag questionComplexity={complexity.getValue()} />,
    }),
    columnHelper.accessor('action', {
      header: '',
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (cell) => (
        <Stack direction="row" spacing={2}>
          <QuestionViewIconButton questionId={cell.row.original.questionID} title={cell.row.original.title} />
          <QuestionDeleteIconButton
            questionId={cell.row.original.questionID}
            onDelete={(questionId) => {
              // Implement delete logic here using the questionId
              console.log(`Delete question with ID ${questionId}`);
            }}
          />
        </Stack>
      ),
    }),
  ] as Array<ColumnDef<QuestionDataRowData>>;
};
