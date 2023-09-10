import DataTable from '../../components/tables/DataTable';
import React, { useEffect, useMemo, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { Skeleton, Stack } from '@chakra-ui/react';
import { type ColumnDef, createColumnHelper, type Column } from '@tanstack/react-table';
import { type QuestionDataRowData, QuestionsTableColumns } from '../../utils/questions';
import IconWithText from '../../components/content/IconWithText';
import { BiSolidBook } from 'react-icons/bi';

const Questions: React.FC = () => {
  const columnHelper = createColumnHelper<QuestionDataRowData>();
  const questionColumns: Array<ColumnDef<QuestionDataRowData>> = useMemo(() => QuestionsTableColumns(columnHelper), []);
  const [questionList, setQuestionList] = useState<QuestionDataRowData[]>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoaded) {
      new QuestionsAPI()
        .getQuestions()
        .then((questions) => {
          setQuestionList(questions);
        })
        .catch(console.error);
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }
  }, []);

  return (
    <Stack paddingX={16} paddingY={8} spacing={6}>
      <IconWithText fontSize="lg" fontWeight="bold" text="Question Repository" icon={<BiSolidBook size={20} />} />
      <Skeleton isLoaded={isLoaded}>
        {questionList !== undefined && (
          <DataTable
            columns={questionColumns}
            tableData={questionList}
            getColumnCanGlobalFilter={(column: Column<QuestionDataRowData>) => column.getCanSort()}
          />
        )}
      </Skeleton>
    </Stack>
  );
};

export default Questions;
