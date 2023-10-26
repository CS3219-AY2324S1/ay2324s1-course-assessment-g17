import { Box, useColorModeValue, Spinner, Center, VStack } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../../components/code/CodeEditor';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import QuestionDetails from './QuestionDetails';
import CodeExecutor from '../../components/code/CodeExecutor';
import { type editor } from 'monaco-editor';

const ViewQuestion: React.FC = () => {
  const { questionId } = useParams(); // Get questionId from URL parameters
  const [questionTitle, setQuestionTitle] = useState<string | null>(null);
  const editorTheme = useColorModeValue('light', 'vs-dark');
  const codeEditor = useRef<editor.IStandaloneCodeEditor | null>(null);

  if (questionId === null || questionId === undefined) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box width="100%" height="85vh" my={5}>
      <Allotment defaultSizes={[7, 9, 5]}>
        <Allotment.Pane>
          <QuestionDetails
            redirectOnInvalid
            questionId={parseInt(questionId, 10)}
            onQuestionTitleChange={(title: string) => {
              setQuestionTitle(title);
            }}
            padding="32px"
          />
        </Allotment.Pane>
        <Allotment.Pane>
          <Box as="div" style={{ maxHeight: '90vh' }}>
            <CodeEditor
              defaultTheme={editorTheme}
              defaultDownloadedFileName={questionTitle ?? 'PeerPrep'}
              ref={codeEditor}
              editorHeight="75vh"
            />
          </Box>
        </Allotment.Pane>
        <Allotment.Pane>
          <VStack as="div" style={{ height: '100%', width: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
            <CodeExecutor defaultTheme={editorTheme} ref={codeEditor} />
          </VStack>
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
};

export default ViewQuestion;
