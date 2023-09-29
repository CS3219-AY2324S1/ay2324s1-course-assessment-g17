import React, { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { type editor } from 'monaco-editor';
import { Box, Button, Flex, HStack, Input, Select, useClipboard, useToast } from '@chakra-ui/react';
import { EditorLanguageEnum, EditorLanguageOptions } from '../../types/code/languages';
import { MdCheck, MdContentCopy, MdTextIncrease, MdTextDecrease } from 'react-icons/md';
import IconButtonWithTooltip from '../content/IconButtonWithTooltip';
import CodeEditorSettings from './CodeEditorSettings';
import { editorLanguageToAcceptedFileExtensionMap, editorLanguageToFileExtensionMap } from '../../utils/code';
import useAwaitableConfirmationDialog from '../content/AwaitableConfirmationDialog';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { useParams } from 'react-router-dom';
import { MonacoBinding } from 'y-monaco';

interface CodeEditorProps {
  defaultTheme: string;
  defaultDownloadedFileName: string;
  enableRealTimeEditing?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  defaultTheme,
  defaultDownloadedFileName,
  enableRealTimeEditing = false,
}: CodeEditorProps) => {
  const toast = useToast();
  const { onCopy, value: clipboardValue, setValue: setClipboardValue, hasCopied } = useClipboard('');
  const codeEditor = useRef<editor.IStandaloneCodeEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { roomId } = useParams();

  const { Confirmation, getConfirmation } = useAwaitableConfirmationDialog();
  const [isCopying, setIsCopying] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);
  const [selectedLanguage, setSelectedLangugage] = useState(EditorLanguageEnum.javascript);
  const [fontSize, setFontSize] = useState<number>(14);

  const handleCopy = (): void => {
    if (clipboardValue === undefined || clipboardValue === '') return;
    onCopy();
    toast({
      title: 'Copied code',
      description: "You've copied your code to your clipboard!",
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDownload = (): void => {
    const code = codeEditor.current?.getValue();
    if (code === undefined || code === '') {
      toast({
        title: 'Empty code not downloaded',
        description: 'No code detected, start coding first!',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const data = new Blob([code]);
    const element = document.createElement('a');
    element.href = URL.createObjectURL(data);
    element.download = `${defaultDownloadedFileName}.${editorLanguageToFileExtensionMap[selectedLanguage]}`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const currCode = codeEditor.current?.getModel()?.getValue();
    if (currCode !== null && currCode?.trim() !== '') {
      await getConfirmation(
        'Replace code?',
        "Are you sure you want to import this file? Doing so will replace the your code with the file's contents. This action is irreversible!",
        'Import file and overwrite exisiting code',
        'Cancel import',
      ).then((confirmation) => {
        if (confirmation) {
          handleImportFile(e);
        }
      });
    } else {
      handleImportFile(e);
    }
  };

  const handleImportFile: React.ChangeEventHandler<HTMLInputElement> = (e): void => {
    const file = e.target.files;
    if (file === null || file.length === 0) {
      toast({
        title: 'No files uploaded',
        description: 'Looks like something went wrong, no files were detected for upload...',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (rd) => {
      const data = rd.target?.result as string;
      codeEditor.current?.getModel()?.setValue(data);
    };
    reader.onerror = (err) => {
      toast({
        title: 'Something went wrong...',
        description: err.target?.error?.name,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    };
    reader.readAsText(file[0]);
  };

  useEffect(() => {
    setSelectedTheme(defaultTheme);
  }, [defaultTheme]);

  useEffect(() => {
    // workaround as onCopy is not imperative, cannot rely it to run with the updated
    // value set by setClipboardValue
    if (isCopying) {
      handleCopy();
      setIsCopying(false);
    }
  }, [isCopying]);

  return (
    <Box paddingX={4}>
      <Input
        type="file"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onChange={handleFileSelect}
        hidden
        ref={fileInputRef}
        accept={editorLanguageToAcceptedFileExtensionMap[selectedLanguage]}
      />
      <Flex
        marginBottom={2}
        paddingX={8}
        paddingY={2}
        borderTopRadius={4}
        _light={{ backgroundColor: 'gray.200' }}
        _dark={{ backgroundColor: 'gray.700' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Select
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLangugage(e.target.value as EditorLanguageEnum);
          }}
          maxWidth="fit-content"
          variant="unstyled"
          fontWeight="bold"
        >
          {EditorLanguageOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <HStack>
          <IconButtonWithTooltip
            aria-label="Increase font size"
            icon={<MdTextIncrease />}
            onClick={() => {
              setFontSize(fontSize + 1);
            }}
            tooltipLabel="Increase font size"
          />

          <IconButtonWithTooltip
            aria-label="Decrease font size"
            icon={<MdTextDecrease />}
            onClick={() => {
              setFontSize(Math.max(fontSize - 1, 1));
            }}
            tooltipLabel="Increase font size"
          />

          <Button
            aria-label="Copy Code"
            leftIcon={hasCopied ? <MdCheck /> : <MdContentCopy />}
            onClick={() => {
              const copiedCode = codeEditor.current?.getValue();
              if (copiedCode === undefined || copiedCode === '') {
                toast({
                  title: 'Empty code not copied',
                  description: 'No code detected, start coding first!',
                  status: 'warning',
                  duration: 2000,
                  isClosable: true,
                });
                return;
              }
              setClipboardValue(copiedCode);
              setIsCopying(true);
            }}
          >
            {hasCopied ? 'Code Copied!' : 'Copy Code'}
          </Button>

          <CodeEditorSettings
            selectedTheme={selectedTheme}
            toggleSelectedTheme={setSelectedTheme}
            onDownload={handleDownload}
            fileInputRef={fileInputRef}
          />
        </HStack>
      </Flex>

      <Box>
        <Editor
          height="80vh"
          width="100%"
          theme={selectedTheme}
          language={selectedLanguage}
          onMount={(editor) => {
            codeEditor.current = editor;
            const editorModel = editor.getModel();
            if (enableRealTimeEditing && editorModel !== null) {
              if (roomId === undefined) {
                toast({
                  title: 'Could not create room',
                  description: 'Invalid room ID',
                  status: 'error',
                  duration: 2000,
                  isClosable: true,
                });
                return;
              }

              try {
                if (process.env.REACT_APP_COLLABORATION_SERVICE_BACKEND_URL === undefined) {
                  toast({
                    title: 'Server Error',
                    description: 'Could not connect to server',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                  });
                  return;
                }

                const ydoc = new Y.Doc();
                const provider = new WebsocketProvider(
                  process.env.REACT_APP_COLLABORATION_SERVICE_BACKEND_URL,
                  roomId,
                  ydoc,
                );
                const ycontent = ydoc.getText('monaco');
                // eslint-disable-next-line no-new
                new MonacoBinding(ycontent, editorModel, new Set([editor]), provider.awareness);
                console.log('binded');
              } catch (error) {
                console.log('unexpected error', error);
              }
            }
          }}
          options={{
            scrollBeyondLastLine: false,
            fixedOverflowWidgets: true,
            fontSize,
          }}
        />
      </Box>

      <Confirmation />
    </Box>
  );
};

export default CodeEditor;
