import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '../../components/tables/DataTable';
import React, { useEffect, useMemo, useState } from 'react';
import { type QuestionData } from '../../types/questions/questions';
import QuestionsAPI from '../../api/questions/questions';
import { Box, Button, Skeleton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';

const Questions: React.FC = () => {
  const navigate = useNavigate();
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

  const columnHelper = createColumnHelper<QuestionData>();
  const questionDataColumns = useMemo(
    () => [
      columnHelper.accessor('questionID', {
        cell: (id): number => id.getValue(),
        header: 'Question ID',
      }),
      columnHelper.accessor('title', {
        cell: (title): string => title.getValue(),
        header: 'Question Title',
      }),
      columnHelper.accessor('categories', {
        cell: (categories): string => categories.getValue().join(', '),
        header: 'Question Categories',
      }),
      columnHelper.accessor('complexity', {
        cell: (complexity): string => complexity.getValue() as string,
        header: 'Question Complexity',
      }),
      columnHelper.accessor('questionID', {
        header: '',
        cell: (cell) => (
          <Button
            value={cell.getValue()}
            onClick={() => {
              navigate(`/question/${cell.getValue()}`);
            }}
          >
            <ChevronRightIcon />
          </Button>
        ),
      }),
    ],
    [],
  );

  return (
    <Box padding={4}>
      <Skeleton isLoaded={isLoaded}>
        {questionList !== undefined && <DataTable columns={questionDataColumns} tableData={questionList} />}
      </Skeleton>
    </Box>
  );
};

export default Questions;
