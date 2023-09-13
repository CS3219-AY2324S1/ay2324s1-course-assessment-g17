import { Box, Heading, Text, Link, VStack, Divider, useColorModeValue, Badge } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuestionsAPI from '../../api/questions/questions';
import { type QuestionData } from '../../types/questions/questions';

const ViewQuestion: React.FC = () => {
  const { questionId } = useParams(); // Get questionId from URL parameters
  const [question, setQuestion] = useState<QuestionData | null>(null);

  useEffect(() => {
    const fetchQuestion = async (): Promise<void> => {
      try {
        if (questionId !== null && questionId !== undefined) {
          const response = await new QuestionsAPI().getQuestionById(parseInt(questionId, 10));
          setQuestion(response);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    if (questionId !== null && questionId !== undefined) {
      fetchQuestion().catch((error) => {
        console.error('Error handling fetchQuestion promise:', error);
      });
    }
  }, [questionId]);

  if (question === null || question === undefined) {
    return <div>Loading...</div>;
  }

  if (questionId === null || questionId === undefined) {
    return <div>No question ID provided.</div>;
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" textAlign="center">
        {question.title}
      </Heading>
      <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')} mt={2}>
        Complexity: <Badge colorScheme="teal">{question.complexity}</Badge>
      </Text>
      <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')} mt={2}>
        Categories: {question.categories.join(', ')}
      </Text>
      <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')} mt={2}>
        Link to Question: <Link href={question.linkToQuestion}>{question.linkToQuestion}</Link>
      </Text>
      <Divider mt={4} />
      <VStack align="start" spacing={4} mt={4}>
        <Heading as="h2" size="md">
          Description
        </Heading>
        <Text>{question.questionDescription}</Text>
      </VStack>
    </Box>
  );
};

export default ViewQuestion;
