import React from 'react';
import Editor from '@monaco-editor/react';
import { useColorModeValue } from '@chakra-ui/react';

const CodeEditor: React.FC = () => {
  return (
    <Editor
      height="90vh"
      width="70vh"
      theme={useColorModeValue('light', 'vs-dark')}
      defaultLanguage="javascript"
      defaultValue="// some comment"
    />
  );
};

export default CodeEditor;
