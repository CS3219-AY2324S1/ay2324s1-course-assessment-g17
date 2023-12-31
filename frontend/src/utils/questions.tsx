import { type SortingFn, type ColumnDef, type ColumnHelper, type Row } from '@tanstack/react-table';
import {
  QuestionComplexityEnum,
  QuestionComplexityEnumToLevelMap,
  type QuestionData,
} from '../types/questions/questions';
import { Stack, Tag, Wrap, WrapItem } from '@chakra-ui/react';
import QuestionComplexityTag from '../components/questions/QuestionComplexityTag';
import QuestionViewIconButton from '../components/questions/QuestionViewIconButton';
import QuestionDeleteIconButton from '../components/questions/QuestionDeleteIconButton';
import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../api/questions/questions';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../reducers/authSlice';

export interface QuestionDataRowData extends QuestionData {
  action?: undefined;
}

export const ComplexitySortingFn: SortingFn<QuestionData> = (
  rowA: Row<QuestionData>,
  rowB: Row<QuestionData>,
  _columnId: string,
): number => {
  const rowAComplexity: QuestionComplexityEnum = rowA.getValue('complexity');
  const rowBComplexity: QuestionComplexityEnum = rowB.getValue('complexity');
  const rowAComplexityLevel: number = QuestionComplexityEnumToLevelMap[rowAComplexity];
  const rowBComplexityLevel: number = QuestionComplexityEnumToLevelMap[rowBComplexity];
  return rowAComplexityLevel > rowBComplexityLevel ? 1 : rowAComplexityLevel < rowBComplexityLevel ? -1 : 0;
};

export const QuestionsTableColumns = (
  columnHelper: ColumnHelper<QuestionDataRowData>,
  // Accept the setQuestionList prop
  setQuestionList: React.Dispatch<React.SetStateAction<QuestionDataRowData[]>>,
): Array<ColumnDef<QuestionDataRowData>> => {
  const isAdmin = useSelector(selectIsAdmin);

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
      sortingFn: ComplexitySortingFn,
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
          {isAdmin && (
            <QuestionDeleteIconButton
              questionId={cell.row.original.questionID}
              onDelete={(questionId) => {
                // Remove the deleted question from the list
                setQuestionList((prevList) => prevList.filter((question) => question.questionID !== questionId));
              }}
            />
          )}
        </Stack>
      ),
    }),
  ] as Array<ColumnDef<QuestionDataRowData>>;
};
