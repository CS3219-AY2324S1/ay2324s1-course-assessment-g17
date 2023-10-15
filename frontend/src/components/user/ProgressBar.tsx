import React, { useEffect, useState } from 'react';
import { Flex, Text, Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { type User } from '../../types/users/users';
import QuestionsAPI from '../../api/questions/questions';
import { QuestionComplexityEnum } from '../../types/questions/questions';

interface ProgressBarProps {
  user: User;
}

interface AnsweredQuestion {
  id: number;
  userId: number;
  questionId: number;
  complexity: string;
  category: string[];
  answeredAt: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ user }) => {
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [totalEasy, setTotalEasy] = useState(0);
  const [totalMedium, setTotalMedium] = useState(0);
  const [totalHard, setTotalHard] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchUserAnsweredQuestions = async (): Promise<void> => {
      try {
        const response = await fetch(`http://localhost:8000/api/user/get-answered-questions/${user.id}`);
        const data = (await response.json()) as AnsweredQuestion[];
        const easyQuestions = data.filter((question) => question.complexity === 'EASY').length;
        const mediumQuestions = data.filter((question) => question.complexity === 'MEDIUM').length;
        const hardQuestions = data.filter((question) => question.complexity === 'HARD').length;
        setEasyCount(easyQuestions);
        setMediumCount(mediumQuestions);
        setHardCount(hardQuestions);
        setTotalSolved(easyQuestions + mediumQuestions + hardQuestions);

        const questionsAPI = new QuestionsAPI();
        const questions = await questionsAPI.getQuestions();
        const easy = questions.filter((question) => question.complexity === QuestionComplexityEnum.EASY).length;
        const medium = questions.filter((question) => question.complexity === QuestionComplexityEnum.MEDIUM).length;
        const hard = questions.filter((question) => question.complexity === QuestionComplexityEnum.HARD).length;
        setTotalEasy(easy);
        setTotalMedium(medium);
        setTotalHard(hard);
        setTotalQuestions(easy + medium + hard);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserAnsweredQuestions().catch((error) => {
      console.error(error);
    });
  }, [user.id]);

  const easyPercentage = (easyCount / totalEasy) * 100;
  const mediumPercentage = (mediumCount / totalMedium) * 100;
  const hardPercentage = (hardCount / totalHard) * 100;
  const totalPercentage = (totalSolved / totalQuestions) * 100;

  return (
    <Flex direction="column">
      <Text fontSize="sm" m={2}>
        Solved Problems
      </Text>
      <Flex width="100%" direction="row" align="center">
        <CircularProgress size="120px" value={totalPercentage} color="yellow.400">
          <CircularProgressLabel fontSize="14px">{totalSolved} solved</CircularProgressLabel>
        </CircularProgress>
        <Flex width="100%" direction="column" align="left" textAlign="left" ml={6}>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="xs">Easy</Text>
            <Text fontSize="2xs" color="gray.500">
              {easyCount}/{totalEasy}
            </Text>
          </Flex>
          <Progress value={easyPercentage} colorScheme="green" mb={2} />
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="xs">Medium</Text>
            <Text fontSize="2xs" color="gray.500">
              {mediumCount}/{totalMedium}
            </Text>
          </Flex>
          <Progress value={mediumPercentage} colorScheme="yellow" mb={2} />
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="xs">Hard</Text>
            <Text fontSize="2xs" color="gray.500">
              {hardCount}/{totalHard}
            </Text>
          </Flex>
          <Progress value={hardPercentage} colorScheme="red" mb={2} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProgressBar;
