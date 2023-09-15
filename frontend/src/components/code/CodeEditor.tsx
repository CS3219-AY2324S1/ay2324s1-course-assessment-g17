import React, { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { type editor } from 'monaco-editor';
import { Box, Button, Flex, HStack, Select, useClipboard, useToast } from '@chakra-ui/react';
import { EditorLanguageOptions } from '../../types/code/languages';
import { MdContentCopy, MdTextIncrease, MdTextDecrease } from 'react-icons/md';
import IconButtonWithTooltip from '../content/IconButtonWithTooltip';

interface CodeEditorProps {
  defaultTheme?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ defaultTheme }: CodeEditorProps) => {
  const toast = useToast();
  const { onCopy, value: clipboardValue, setValue: setClipboardValue, hasCopied } = useClipboard('');
  const codeEditor = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);
  const [selectedLanguage, setSelectedLangugage] = useState('javascript');
  const [fontSize, setFontSize] = useState<number>(12);

  const handleCopy = (): void => {
    if (clipboardValue === undefined || clipboardValue === '') return;
    onCopy();
    toast({
      title: 'Copied code',
      description: "You've copied your code to your clipboard!",
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  useEffect(() => {
    setSelectedTheme(defaultTheme);
  }, [defaultTheme]);

  useEffect(() => {
    handleCopy();
  }, [clipboardValue]);

  return (
    <Box paddingX={4}>
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
            setSelectedLangugage(e.target.value);
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
            leftIcon={<MdContentCopy />}
            onClick={() => {
              const copiedCode = codeEditor.current?.getValue();
              if (copiedCode === undefined || copiedCode === '') {
                toast({
                  title: 'Empty code not copied',
                  description: 'No code detected, start coding first!',
                  status: 'warning',
                  duration: 4000,
                  isClosable: true,
                });
                return;
              }
              setClipboardValue(copiedCode);
            }}
          >
            {hasCopied ? 'Code Copied' : 'Copy Code'}
          </Button>
        </HStack>
      </Flex>

      <Editor
        height="80vh"
        width="100%"
        theme={selectedTheme}
        language={selectedLanguage}
        onMount={(editor) => {
          codeEditor.current = editor;
        }}
        options={{
          scrollBeyondLastLine: false,
          fontSize,
        }}
      />
    </Box>
  );
};

export default CodeEditor;
