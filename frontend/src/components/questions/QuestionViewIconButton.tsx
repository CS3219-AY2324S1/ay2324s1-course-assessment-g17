import { ChevronRightIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface QuestionViewIconButtonProps {
  questionId: number;
}

const QuestionViewIconButton: React.FC<QuestionViewIconButtonProps> = ({ questionId }: QuestionViewIconButtonProps) => {
  const navigate = useNavigate();
  return (
    <Tooltip label={`View Question ${questionId}`}>
      <IconButton
        aria-label="View Question"
        value={questionId}
        onClick={() => {
          navigate(`/question/${questionId}`);
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Tooltip>
  );
};

export default QuestionViewIconButton;
