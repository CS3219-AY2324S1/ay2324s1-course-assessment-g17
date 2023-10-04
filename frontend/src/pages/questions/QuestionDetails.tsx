import { Heading, Text, Link, VStack, Divider, useColorModeValue, Spinner, Center, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { type QuestionData } from '../../types/questions/questions';
import QuestionComplexityTag from '../../components/questions/QuestionComplexityTag';
import QuestionEditIconButton from '../../components/questions/QuestionEditIconButton';
import { selectIsAdmin } from '../../reducers/authSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

interface QuestionDetailsProps {
  questionId: number;
  onQuestionTitleChange?: (title: string) => void;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({
  questionId,
  onQuestionTitleChange,
}: QuestionDetailsProps) => {
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const colourScheme = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchQuestion = async (): Promise<void> => {
      try {
        if (questionId !== null && questionId !== undefined) {
          const response = await new QuestionsAPI().getQuestionById(questionId);
          if (response == null) {
            navigate('/404');
          }
          setQuestion(response);
          onQuestionTitleChange !== undefined && onQuestionTitleChange(response?.title ?? '');
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
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (questionId === null || questionId === undefined) {
    return <div>No question ID provided.</div>;
  }

  return (
    <VStack as="div" style={{ overflowY: 'auto', height: '100%', padding: '16px' }}>
      <Heading as="h1" size="xl" textAlign="center">
        {question.title}
        {isAdmin && <QuestionEditIconButton questionId={question.questionID} title={question.title} />}
      </Heading>
      <Text fontSize="md" color={colourScheme} mt={2}>
        <span style={{ fontWeight: 'bold' }}>Complexity: </span>
        <QuestionComplexityTag questionComplexity={question.complexity} />
      </Text>
      <Text fontSize="md" color={colourScheme} mt={2}>
        <span style={{ fontWeight: 'bold' }}>Categories:</span> {question.categories.join(', ')}
      </Text>
      <Text fontSize="md" color={colourScheme} mt={2}>
        <span style={{ fontWeight: 'bold' }}>Link to Question: </span>
        <Link href={question.linkToQuestion}>{question.linkToQuestion}</Link>
      </Text>
      <Divider mt={4} />
      <Box ml="8px" minWidth={'80%'}>
        <VStack align="start" spacing={4} mt={4}>
          <Heading as="h2" size="md">
            Description
          </Heading>
          <Text
            whiteSpace="pre-line"
            dangerouslySetInnerHTML={{
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
              __html: DOMPurify.sanitize(question.questionDescription),
            }}
          />
        </VStack>
      </Box>
    </VStack>
  );
};

export default QuestionDetails;
