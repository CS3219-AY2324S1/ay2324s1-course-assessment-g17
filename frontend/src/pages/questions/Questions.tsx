import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '../../components/tables/DataTable';
import React, { useEffect, useState } from 'react';
import { type QuestionData } from '../../types/questions/questions';
import QuestionsAPI from '../../api/questions/questions';
import { Skeleton } from '@chakra-ui/react';

const columnHelper = createColumnHelper<QuestionData>();
const questionDataColumns = [
  columnHelper.accessor('questionID', {
    cell: (id): number => id.getValue(),
    header: 'Question ID'
  }),
  columnHelper.accessor('title', {
    cell: (title): string => title.getValue(),
    header: 'Question Title'
  }),
  columnHelper.accessor('categories', {
    cell: (categories): string => categories.getValue().join(', '),
    header: 'Question Categories'
  }),
  columnHelper.accessor('complexity', {
    cell: (complexity): string => complexity.getValue() as string,
    header: 'Question Complexity'
  })
];

const Questions: React.FC = () => {
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
      setTimeout(() => { setIsLoaded(true); }, 1000);
    }
  }, []);

  return (
    <Skeleton isLoaded={isLoaded}>
      {(questionList !== undefined) && <DataTable columns={questionDataColumns} tableData={questionList} />}
    </Skeleton>
  );
};

export default Questions;
