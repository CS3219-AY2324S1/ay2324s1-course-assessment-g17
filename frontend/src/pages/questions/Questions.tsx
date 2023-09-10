import DataTable from '../../components/tables/DataTable';
import React, { useEffect, useMemo, useState } from 'react';
import { type QuestionData } from '../../types/questions/questions';
import QuestionsAPI from '../../api/questions/questions';
import { Box, Skeleton } from '@chakra-ui/react';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { QuestionsTableColumns } from '../../utils/questions';

const Questions: React.FC = () => {
  const columnHelper = createColumnHelper<QuestionData>();
  const questionColumns: Array<ColumnDef<QuestionData>> = useMemo(() => QuestionsTableColumns(columnHelper), []);
  const [questionList, setQuestionList] = useState<QuestionData[]>();
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
    <Box padding={8}>
      <Skeleton isLoaded={isLoaded}>
        {questionList !== undefined && <DataTable columns={questionColumns} tableData={questionList} />}
      </Skeleton>
    </Box>
  );
};

export default Questions;
