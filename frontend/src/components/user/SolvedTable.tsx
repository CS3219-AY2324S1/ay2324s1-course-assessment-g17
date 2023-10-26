import DataTable from '../../components/tables/DataTable';
import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { BiSolidBook } from 'react-icons/bi';
import { Flex, Skeleton, Stack } from '@chakra-ui/react';
import { type ColumnDef, createColumnHelper, type Column } from '@tanstack/react-table';
import { type QuestionDataRowData, QuestionsTableColumns } from '../../utils/questions';
import IconWithText from '../content/IconWithText';
import { type User } from '../../types/users/users';
interface SolvedTableProps {
  user: User; // Assuming you have a User type defined
}

interface AnsweredQuestion {
  id: number;
  userId: number;
  questionId: number;
  complexity: string;
  category: string[];
  answeredAt: string;
}

const SolvedTable: React.FC<SolvedTableProps> = ({ user }) => {
  const columnHelper = createColumnHelper<QuestionDataRowData>();
  const [solvedList, setSolvedList] = useState<QuestionDataRowData[]>([]);
  const questionColumns: Array<ColumnDef<QuestionDataRowData>> = QuestionsTableColumns(columnHelper, setSolvedList);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const backendUrl = process.env.REACT_APP_USER_SERVICE_BACKEND_URL;
  useEffect(() => {
    const fetchSolvedQuestions = async (): Promise<void> => {
      try {
        const response = await fetch(`${backendUrl}api/user/get-answered-questions/${user.id}`);
        const data = (await response.json()) as AnsweredQuestion[];
        const solvedQuestionIds = data.map((question) => question.questionId);

        const questions = await new QuestionsAPI().getQuestions();
        const solvedQuestions = questions.filter((question) => solvedQuestionIds.includes(question.questionID));

        setSolvedList(solvedQuestions);
        setIsLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    if (!isLoaded) {
      fetchSolvedQuestions().catch((error) => {
        console.error(error);
      });
    }
  }, [user, isLoaded]);

  return (
    <Stack spacing={6}>
      <Flex justifyContent={'space-between'}>
        <IconWithText fontSize="lg" fontWeight="bold" text="Solved Questions" icon={<BiSolidBook size={20} />} />
      </Flex>
      <Skeleton isLoaded={isLoaded}>
        {solvedList !== undefined && (
          <DataTable
            columns={questionColumns}
            tableData={solvedList}
            getColumnCanGlobalFilter={(column: Column<QuestionDataRowData>) => column.getCanSort()}
          />
        )}
      </Skeleton>
    </Stack>
  );
};

export default SolvedTable;
