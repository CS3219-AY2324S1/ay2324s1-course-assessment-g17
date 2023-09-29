import DataTable from '../../components/tables/DataTable';
import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import IconWithText from '../../components/content/IconWithText';
import { BiSolidBook } from 'react-icons/bi';
import { Button, Flex, Skeleton, Stack } from '@chakra-ui/react';
import { type ColumnDef, createColumnHelper, type Column } from '@tanstack/react-table';
import { type QuestionDataRowData, QuestionsTableColumns } from '../../utils/questions';
import { Link } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';

const Questions: React.FC = () => {
  const columnHelper = createColumnHelper<QuestionDataRowData>();
  const [questionList, setQuestionList] = useState<QuestionDataRowData[]>([]);
  // Pass setQuestionList as a prop to the QuestionsTableColumns function
  const questionColumns: Array<ColumnDef<QuestionDataRowData>> = QuestionsTableColumns(columnHelper, setQuestionList);
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
    <Stack spacing={6}>
      <Flex justifyContent={'space-between'}>
        <IconWithText fontSize="lg" fontWeight="bold" text="Question Repository" icon={<BiSolidBook size={20} />} />
        <Link to="/questions/new">
          <Button leftIcon={<AddIcon />} colorScheme="teal">
            New Question
          </Button>
        </Link>
      </Flex>
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
