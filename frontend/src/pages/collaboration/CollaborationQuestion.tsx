import { Box, HStack, VStack, Text, NumberInput, NumberInputField, Button } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import QuestionDetails from '../questions/QuestionDetails';
import { SocketContext } from '../../context/socket';

const CollaborationQuestion: React.FC = () => {
  const [questionIdInput, setQuestionIdInput] = useState<number | undefined>(undefined);
  const [questionId, setQuestionId] = useState<number | undefined>(undefined);
  const [disableSelection, setDisableSelection] = useState(false);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket?.on('set-question', (questionId: number) => {
      setQuestionId(questionId);
      setQuestionIdInput(questionId);
      // disable manual question selection for normal matches (?)
      setDisableSelection(true);
    });
  }, [socket]);

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
              setQuestionId(questionIdInput);
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
