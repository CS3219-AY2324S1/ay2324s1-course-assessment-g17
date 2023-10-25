import { type editor } from 'monaco-editor';
import { type EditorLanguageEnum } from '../../types/code/languages';
import {
  ExecutorStatus,
  type ExecutorStatusData,
  EditorLanguageToExecutorLanguagesMap,
} from '../../types/code/executor';
import ExecutorAPI from '../../api/code/executor';
import { Button, useToast } from '@chakra-ui/react';
import React, {
  type ForwardedRef,
  useState,
  forwardRef,
  type ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
} from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CodeExecutorProps {}

const CodeExecutor: ForwardRefRenderFunction<editor.IStandaloneCodeEditor, CodeExecutorProps> = (
  _props,
  editorForwardedRef: ForwardedRef<editor.IStandaloneCodeEditor>,
) => {
  const executorApi = new ExecutorAPI();
  const toast = useToast();
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const codeEditor = useRef<editor.IStandaloneCodeEditor | null>(null);
  useImperativeHandle<editor.IStandaloneCodeEditor | null, editor.IStandaloneCodeEditor | null>(
    editorForwardedRef,
    () => codeEditor.current,
  );

  const onCompile = async (): Promise<void> => {
    setIsCompiling(true);
    const editorLanguageEnum = codeEditor.current?.getModel()?.getLanguageId() as EditorLanguageEnum;
    const code = codeEditor.current?.getModel()?.getValue() ?? '';
    const submissionToken = await executorApi.submitCode({
      language_id: EditorLanguageToExecutorLanguagesMap[editorLanguageEnum].id,
      source_code: btoa(code),
      stdin: btoa(''),
    });
    const executorStatusData = await pollExecutionOutput(submissionToken);
    if (executorStatusData.status?.id === ExecutorStatus.ACCEPTED) {
      toast({
        title: 'Successfully executed code',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Failed to run code',
        description: executorStatusData.status?.description ?? executorStatusData.error,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
    setIsCompiling(false);
  };

  const pollExecutionOutput = async (submissionToken: string): Promise<ExecutorStatusData> => {
    let executorStatusData = await executorApi.getExecutorSubmissionData(submissionToken);
    let executorStatus = executorStatusData.status?.id;
    while (executorStatus === ExecutorStatus.IN_QUEUE || executorStatus === ExecutorStatus.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      executorStatusData = await executorApi.getExecutorSubmissionData(submissionToken);
      executorStatus = executorStatusData.status?.id;
    }
    return executorStatusData;
  };

  return <Button disabled={isCompiling}>Run code</Button>;
};

export default forwardRef(CodeExecutor);
