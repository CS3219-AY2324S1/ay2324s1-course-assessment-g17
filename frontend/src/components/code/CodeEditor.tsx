import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  forwardRef,
  type ForwardedRef,
  type ForwardRefRenderFunction,
  type MutableRefObject,
} from 'react';
import Editor from '@monaco-editor/react';
import { type editor } from 'monaco-editor';
import { Box, Button, Flex, HStack, Input, Select, useClipboard, useToast } from '@chakra-ui/react';
import { EditorLanguageEnum, EditorLanguageEnumToLabelMap, EditorLanguageOptions } from '../../types/code/languages';
import { MdCheck, MdContentCopy, MdTextIncrease, MdTextDecrease } from 'react-icons/md';
import IconButtonWithTooltip from '../content/IconButtonWithTooltip';
import CodeEditorSettings from './CodeEditorSettings';
import { editorLanguageToAcceptedFileExtensionMap, editorLanguageToFileExtensionMap } from '../../utils/code';
import useAwaitableConfirmationDialog from '../content/AwaitableConfirmationDialog';
import RandomColor from 'randomcolor';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { useParams } from 'react-router-dom';
import { MonacoBinding } from 'y-monaco';
import { selectUser } from '../../reducers/authSlice';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { setAwareness } from '../../reducers/awarenessSlice';
import { SocketContext } from '../../context/socket';
import { type AwarenessUser } from '../../types/code/awareness';

interface CodeEditorProps {
  defaultTheme: string;
  defaultDownloadedFileName: string;
  enableRealTimeEditing?: boolean;
  editorHeight: string | number;
}

const CodeEditor: ForwardRefRenderFunction<editor.IStandaloneCodeEditor, CodeEditorProps> = (
  { defaultTheme, defaultDownloadedFileName, editorHeight, enableRealTimeEditing = false }: CodeEditorProps,
  editorForwardedRef: ForwardedRef<editor.IStandaloneCodeEditor>,
) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { onCopy, value: clipboardValue, setValue: setClipboardValue, hasCopied } = useClipboard('');
  const codeEditor = editorForwardedRef as MutableRefObject<editor.IStandaloneCodeEditor>;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { roomId } = useParams();
  const user = useAppSelector(selectUser);

  const { Confirmation, getConfirmation } = useAwaitableConfirmationDialog();
  const [isCopying, setIsCopying] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);
  const [selectedLanguage, setSelectedLanguage] = useState(EditorLanguageEnum.javascript);
  const [fontSize, setFontSize] = useState<number>(14);
  const { socket } = useContext(SocketContext);

  const handleLanguageChange = (newLanguage: EditorLanguageEnum): void => {
    setSelectedLanguage(newLanguage);

    // Emit the selected language change to the Socket.IO server.
    socket?.emit('language-change', roomId, newLanguage);
  };

  const setInitialLanguage = (): void => {
    // Listen for the "initial-language" event from the Socket.IO server.
    socket?.on('initial-language', (initialLanguage: EditorLanguageEnum) => {
      // Set the initial language received from the server.
      setSelectedLanguage(initialLanguage);
    });
  };

  // Runs once when the component mounts to set the initial language.
  useEffect(() => {
    if (!enableRealTimeEditing) return;
    if (roomId === undefined) {
      toast({
        title: 'Could not create room',
        description: 'Invalid room ID',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      console.error('Could not create room: Invalid room ID');
    } else {
      setInitialLanguage();

      // Listen for receive-language-change event from the Socket.IO server.
      socket?.on('receive-language-change', (newLanguage: EditorLanguageEnum, username?: string) => {
        // Update the selected language with the new language received from the Socket.IO server.
        setSelectedLanguage(newLanguage);
        toast({
          title:
            username === undefined
              ? `Language changed to ${EditorLanguageEnumToLabelMap[newLanguage]}`
              : `${username} changed language to ${EditorLanguageEnumToLabelMap[newLanguage]}`,
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      });
    }
  }, [socket]);

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
            console.log('changing lang...');
            const newLanguage = e.target.value as EditorLanguageEnum;
            handleLanguageChange(newLanguage); // Set and emit the language change event to the server.
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
          height={editorHeight}
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
                if (process.env.REACT_APP_COLLABORATION_SERVICE_WEBSOCKET_BACKEND_URL === undefined) {
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
                  process.env.REACT_APP_COLLABORATION_SERVICE_WEBSOCKET_BACKEND_URL,
                  roomId,
                  ydoc,
                );
                const ycontent = ydoc.getText('monaco');
                const awareness = provider.awareness;
                const color = RandomColor({ luminosity: 'light' });

                awareness.setLocalStateField('user', {
                  name: user?.username,
                  userId: user?.id,
                  email: user?.email,
                  color,
                });

                awareness.on('change', (changes: { added: number[]; updated: number[]; removed: number[] }) => {
                  const awarenessStates = awareness.getStates();
                  dispatch(setAwareness(awareness as AwarenessUser));
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  changes.added.forEach((clientId) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const state = awarenessStates.get(clientId)?.user;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
                    const color = state?.color;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
                    const username = state?.name;
                    const cursorStyleElem = document.head.appendChild(document.createElement('style'));
                    cursorStyleElem.innerHTML = `.yRemoteSelectionHead-${clientId} { border-left: ${color} solid 2px;}`;
                    const highlightStyleElem = document.head.appendChild(document.createElement('style'));
                    highlightStyleElem.innerHTML = `.yRemoteSelection-${clientId} { background-color: ${color}9A;}`;
                    const styleElem = document.head.appendChild(document.createElement('style'));
                    styleElem.innerHTML = `.yRemoteSelectionHead-${clientId}::after { background-color: ${color}; color: black; content: '${username}'}`;
                  });
                });

                // eslint-disable-next-line no-new
                new MonacoBinding(ycontent, editorModel, new Set([editor]), awareness);
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

export default forwardRef(CodeEditor);
