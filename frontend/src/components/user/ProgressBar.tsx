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
        const easyQuestions = data.filter((question) => question.complexity === 'Easy');
        const mediumQuestions = data.filter((question) => question.complexity === 'Medium');
        const hardQuestions = data.filter((question) => question.complexity === 'Hard');
        const uniqueEasyQuestions = new Set(easyQuestions.map((question) => question.questionId));
        const uniqueMediumQuestions = new Set(mediumQuestions.map((question) => question.questionId));
        const uniqueHardQuestions = new Set(hardQuestions.map((question) => question.questionId));
        setEasyCount(uniqueEasyQuestions.size);
        setMediumCount(uniqueMediumQuestions.size);
        setHardCount(uniqueHardQuestions.size);
        setTotalSolved(uniqueEasyQuestions.size + uniqueMediumQuestions.size + uniqueHardQuestions.size);

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
      <Text fontSize="md" m={2}>
        Solved Problems
      </Text>
      <Flex width="100%" direction="row" align="center">
        <CircularProgress size="180px" value={totalPercentage} color="yellow.400">
          <CircularProgressLabel fontSize="18px">{totalSolved} solved</CircularProgressLabel>
        </CircularProgress>
        <Flex width="100%" direction="column" align="left" textAlign="left" ml={6}>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="sm">Easy</Text>
            <Text fontSize="sm" color="gray.500">
              {easyCount}/{totalEasy}
            </Text>
          </Flex>
          <Progress value={easyPercentage} colorScheme="green" mb={2} />
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="sm">Medium</Text>
            <Text fontSize="sm" color="gray.500">
              {mediumCount}/{totalMedium}
            </Text>
          </Flex>
          <Progress value={mediumPercentage} colorScheme="yellow" mb={2} />
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="sm">Hard</Text>
            <Text fontSize="sm" color="gray.500">
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
