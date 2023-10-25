import { type editor } from 'monaco-editor';
import { EditorLanguageEnum } from '../../types/code/languages';
import {
  ExecutorStatus,
  type ExecutorStatusData,
  EditorLanguageToExecutorLanguagesMap,
} from '../../types/code/executor';
import ExecutorAPI from '../../api/code/executor';
import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import React, {
  useState,
  forwardRef,
  type ForwardedRef,
  type ForwardRefRenderFunction,
  type MutableRefObject,
  useRef,
} from 'react';
import { Allotment } from 'allotment';
import { Editor } from '@monaco-editor/react';
import { TbPlayerPlayFilled } from 'react-icons/tb';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CodeExecutorProps {
  defaultTheme: string;
}

const CodeExecutor: ForwardRefRenderFunction<editor.IStandaloneCodeEditor, CodeExecutorProps> = (
  { defaultTheme }: CodeExecutorProps,
  editorForwardedRef: ForwardedRef<editor.IStandaloneCodeEditor>,
) => {
  const executorApi = new ExecutorAPI();
  const toast = useToast();
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const programOutput = useRef<editor.IStandaloneCodeEditor | null>(null);
  const programInput = useRef<editor.IStandaloneCodeEditor | null>(null);
  const codeEditor = editorForwardedRef as MutableRefObject<editor.IStandaloneCodeEditor>;

  const onCompile = async (): Promise<void> => {
    try {
      setIsCompiling(true);
      const editorLanguageEnum = codeEditor.current?.getModel()?.getLanguageId() as EditorLanguageEnum;
      const code = codeEditor.current?.getModel()?.getValue() ?? '';
      const stdin = programInput.current?.getModel()?.getValue() ?? '';
      const submissionToken = await executorApi.submitCode({
        language_id: EditorLanguageToExecutorLanguagesMap[editorLanguageEnum].id,
        source_code: btoa(code),
        stdin: btoa(stdin),
      });
      const executorStatusData = await pollExecutionOutput(submissionToken);
      if (executorStatusData.status?.id === ExecutorStatus.ACCEPTED) {
        const stdout = atob(executorStatusData?.stdout ?? '');
        const time = executorStatusData.time !== undefined ? `Ran in ${executorStatusData.time}s` : '';
        const memory = executorStatusData.memory !== undefined ? `Used ${executorStatusData.memory}kb of memory` : '';
        const stats = [stdout, time, memory].join('\n');
        programOutput.current?.getModel()?.setValue(stats);
        toast({
          title: 'Successfully executed code',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        const stderr = atob(executorStatusData?.stderr ?? '');
        const compileError = atob(executorStatusData?.compile_output ?? '');
        const error = [stderr, compileError].join('\n');
        programOutput.current?.getModel()?.setValue(error);
        toast({
          title: 'Failed to run code',
          description: executorStatusData.status?.description ?? executorStatusData.error,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Something went wrong',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      console.log('Error:', error);
    } finally {
      setIsCompiling(false);
    }
  };

  const pollExecutionOutput = async (submissionToken: string): Promise<ExecutorStatusData> => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    let executorStatusData = await executorApi.getExecutorSubmissionData(submissionToken);
    let executorStatus = executorStatusData.status?.id;
    while (executorStatus === ExecutorStatus.IN_QUEUE || executorStatus === ExecutorStatus.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      executorStatusData = await executorApi.getExecutorSubmissionData(submissionToken);
      executorStatus = executorStatusData.status?.id;
    }
    return executorStatusData;
  };

  return (
    <Box width="100%" height="90vh">
      <Allotment vertical>
        <Allotment.Pane minSize={100}>
          <Box as="div" style={{ maxHeight: '45vh' }}>
            <Flex
              marginBottom={2}
              paddingX={4}
              paddingY={2}
              borderTopRadius={4}
              _light={{ backgroundColor: 'gray.200' }}
              _dark={{ backgroundColor: 'gray.700' }}
            >
              <Flex width="100%" justify="space-between" align="center">
                <Text as="span" fontWeight="bold">
                  Program Output
                </Text>
              </Flex>
            </Flex>
            <Editor
              height="35vh"
              width="100%"
              theme={defaultTheme}
              language={EditorLanguageEnum.text}
              onMount={(editor) => {
                programOutput.current = editor;
              }}
              options={{
                scrollBeyondLastLine: false,
                fixedOverflowWidgets: true,
                fontSize: 14,
                readOnly: true,
                domReadOnly: true,
                lineNumbersMinChars: 3,
                glyphMargin: false,
                folding: false,
              }}
            />
          </Box>
        </Allotment.Pane>
        <Allotment.Pane>
          <Box as="div" style={{ maxHeight: '40vh', marginTop: '16px' }}>
            <Flex
              marginBottom={2}
              paddingX={4}
              paddingY={2}
              borderTopRadius={4}
              _light={{ backgroundColor: 'gray.200' }}
              _dark={{ backgroundColor: 'gray.700' }}
            >
              <Flex width="100%" justify="space-between" align="center">
                <Text as="span" fontWeight="bold">
                  Input
                </Text>
                <Button
                  size="sm"
                  leftIcon={<TbPlayerPlayFilled />}
                  disabled={isCompiling}
                  onClick={() => {
                    void onCompile();
                  }}
                >
                  Run code
                </Button>
              </Flex>
            </Flex>
            <Editor
              height="32vh"
              width="100%"
              theme={defaultTheme}
              language={EditorLanguageEnum.text}
              onMount={(editor) => {
                programInput.current = editor;
              }}
              options={{
                scrollBeyondLastLine: false,
                fixedOverflowWidgets: true,
                fontSize: 14,
                lineNumbersMinChars: 3,
                glyphMargin: false,
                folding: false,
              }}
            />
          </Box>
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
};

export default forwardRef(CodeExecutor);
