import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Select } from '@chakra-ui/react';
import { EditorLanguageOptions } from '../../types/code/languages';

interface CodeEditorProps {
  theme?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ theme }: CodeEditorProps) => {
  const [selectedLanguage, setSelectedLangugage] = useState('javascript');
  return (
    <>
      <Select
        value={selectedLanguage}
        onChange={(e) => {
          setSelectedLangugage(e.target.value);
        }}
      >
        {EditorLanguageOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Editor height="85vh" width="100%" theme={theme} language={selectedLanguage} />
    </>
  );
};

export default CodeEditor;
