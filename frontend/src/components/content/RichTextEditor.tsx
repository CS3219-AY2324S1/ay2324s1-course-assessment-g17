// RichTextEditor.tsx
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { RichTextEditor as MantineRichTextEditor } from '@mantine/rte';
import { type useColorModeValue } from '@chakra-ui/react';

interface RichTextEditorProps {
  value: string;
  onChange: (newContent: React.SetStateAction<string>) => void;
  useColorModeValue: typeof useColorModeValue;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, useColorModeValue }) => {
  return (
    <MantineProvider theme={{ colorScheme: useColorModeValue('light', 'dark') }}>
      <MantineRichTextEditor
        value={value}
        onChange={onChange}
        placeholder="Enter question description..."
        controls={[
          ['bold', 'italic', 'underline', 'link', 'code', 'blockquote'],
          ['unorderedList', 'orderedList', 'h1', 'h2', 'h3'],
          ['sup', 'sub'],
          ['alignLeft', 'alignCenter', 'alignRight'],
        ]}
      />
    </MantineProvider>
  );
};

export default RichTextEditor;
