import {
  Heading,
  Text,
  Link,
  VStack,
  Divider,
  useColorModeValue,
  Spinner,
  Center,
  Box,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { type QuestionData } from '../../types/questions/questions';
import QuestionComplexityTag from '../../components/questions/QuestionComplexityTag';
import QuestionEditIconButton from '../../components/questions/QuestionEditIconButton';
import { selectIsAdmin } from '../../reducers/authSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import '../../App.css';

interface QuestionDetailsProps {
  questionId: number;
  onQuestionTitleChange?: (title: string) => void;
  redirectOnInvalid?: boolean;
  padding?: number | string;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({
  questionId,
  onQuestionTitleChange,
  redirectOnInvalid = false,
  padding = '16px',
}: QuestionDetailsProps) => {
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const colourScheme = useColorModeValue('gray.600', 'gray.400');
  const toast = useToast();

  useEffect(() => {
    const fetchQuestion = async (): Promise<void> => {
      try {
        if (questionId !== null && questionId !== undefined) {
          setIsLoading(true);
          const response = await new QuestionsAPI().getQuestionById(questionId);
          if (response == null) {
            if (redirectOnInvalid) {
              navigate('/404');
            } else {
              toast({
                title: 'Question not found!',
                description: "Uh oh, we couldn't find that question...",
                status: 'error',
                duration: 4000,
                isClosable: true,
              });
            }
          } else {
            setQuestion(response);
            onQuestionTitleChange !== undefined && onQuestionTitleChange(response?.title ?? '');
          }
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (questionId !== null && questionId !== undefined) {
      fetchQuestion().catch((error) => {
        console.error('Error handling fetchQuestion promise:', error);
      });
    }
  }, [questionId]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (questionId === null || questionId === undefined) {
    return <div>No question ID provided.</div>;
  }

  if (question === null) {
    return <div>Could not find question.</div>;
  }

  return (
    <VStack as="div" style={{ overflowY: 'auto', overflowX: 'auto', height: '100%' }} padding={padding}>
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
      <Box ml="8px" minWidth="80%" maxWidth="100%" overflow="scroll">
        <VStack align="start" spacing={4} mt={4}>
          <Heading as="h2" size="md">
            Description
          </Heading>
          <Box maxWidth="100%">
            <Text
              id="questionDescription"
              whiteSpace="pre-line"
              dangerouslySetInnerHTML={{
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                __html: DOMPurify.sanitize(question.questionDescription),
              }}
            />
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
};

export default QuestionDetails;
