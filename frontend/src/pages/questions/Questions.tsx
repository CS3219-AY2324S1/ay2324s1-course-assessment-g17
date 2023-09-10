import DataTable from '../../components/tables/DataTable';
import React, { useEffect, useMemo, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { Box, Skeleton } from '@chakra-ui/react';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { type QuestionDataRowData, QuestionsTableColumns } from '../../utils/questions';

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
    <Box paddingX={16} paddingY={8}>
      <Skeleton isLoaded={isLoaded}>
        {questionList !== undefined && <DataTable columns={questionColumns} tableData={questionList} />}
      </Skeleton>
    </Box>
  );
};

export default Questions;
