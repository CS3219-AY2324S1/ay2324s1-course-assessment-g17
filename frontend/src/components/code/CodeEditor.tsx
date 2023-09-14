import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  theme?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ theme }: CodeEditorProps) => {
  return (
    <Editor height="85vh" width="100%" theme={theme} defaultLanguage="javascript" defaultValue="// some comment" />
  );
};

export default CodeEditor;
