import { Box, HStack, VStack, Text, NumberInput, NumberInputField, Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import QuestionDetails from '../questions/QuestionDetails';

interface CollaborationQuestionProps {
  disableSelection: boolean;
  questionId?: number;
  onQuestionIdChange: (newQuestionId?: number) => void;
}

const CollaborationQuestion: React.FC<CollaborationQuestionProps> = ({
  questionId,
  disableSelection,
  onQuestionIdChange,
}: CollaborationQuestionProps) => {
  const [questionIdInput, setQuestionIdInput] = useState<number | undefined>(undefined);

  return (
    <VStack as="div" style={{ overflowY: 'auto', height: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
      <Box
        width="100%"
        padding={4}
        alignSelf="flex-start"
        _light={{ backgroundColor: 'gray.200' }}
        _dark={{ backgroundColor: 'gray.700' }}
        borderRadius={8}
      >
        <HStack spacing={4}>
          <Text>Selected Question ID</Text>
          <NumberInput
            size="sm"
            maxWidth="80px"
            value={questionIdInput}
            onChange={(e) => {
              setQuestionIdInput(parseInt(e, 10));
            }}
            isDisabled={disableSelection}
          >
            <NumberInputField />
          </NumberInput>
          <Button
            size="sm"
            onClick={() => {
              onQuestionIdChange(questionIdInput);
            }}
            disabled={disableSelection}
          >
            Update
          </Button>
        </HStack>
      </Box>
      {questionId === undefined && (
        <Text mt={16} size="xl">
          No question selected yet
        </Text>
      )}
      {questionId !== undefined && <QuestionDetails questionId={questionId} />}
    </VStack>
  );
};

export default CollaborationQuestion;
