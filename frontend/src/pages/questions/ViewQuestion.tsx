import { Box, useColorModeValue, Spinner, Center } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../../components/code/CodeEditor';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import QuestionDetails from './QuestionDetails';

const ViewQuestion: React.FC = () => {
  const { questionId } = useParams(); // Get questionId from URL parameters
  const [questionTitle, setQuestionTitle] = useState<string | null>(null);
  const editorTheme = useColorModeValue('light', 'vs-dark');

  if (questionId === null || questionId === undefined) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box width="100%" height="100vh" my={5}>
      <Allotment>
        <Allotment.Pane>
          <QuestionDetails
            questionId={parseInt(questionId, 10)}
            onQuestionTitleChange={(title: string) => {
              setQuestionTitle(title);
            }}
          />
        </Allotment.Pane>
        <Allotment.Pane>
          <Box as="div" style={{ maxHeight: '85vh' }}>
            <CodeEditor defaultTheme={editorTheme} defaultDownloadedFileName={questionTitle ?? 'PeerPrep'} />
          </Box>
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
};

export default ViewQuestion;
