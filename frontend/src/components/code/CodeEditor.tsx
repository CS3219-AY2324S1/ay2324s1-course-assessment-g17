import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Flex, HStack, Select } from '@chakra-ui/react';
import { EditorLanguageOptions } from '../../types/code/languages';
import { MdTextIncrease, MdTextDecrease } from 'react-icons/md';
import IconButtonWithTooltip from '../content/IconButtonWithTooltip';

interface CodeEditorProps {
  defaultTheme?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ defaultTheme }: CodeEditorProps) => {
  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);
  const [selectedLanguage, setSelectedLangugage] = useState('javascript');
  const [fontSize, setFontSize] = useState<number>(12);

  useEffect(() => {
    setSelectedTheme(defaultTheme);
  }, [defaultTheme]);

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
        </HStack>
      </Flex>

      <Editor
        height="85vh"
        width="100%"
        theme={selectedTheme}
        language={selectedLanguage}
        options={{
          scrollBeyondLastLine: false,
          fontSize,
        }}
      />
    </Box>
  );
};

export default CodeEditor;
