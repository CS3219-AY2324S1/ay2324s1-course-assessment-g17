import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface QuestionViewIconButtonProps {
  questionId: number;
  title: string;
}

const QuestionViewIconButton: React.FC<QuestionViewIconButtonProps> = ({
  questionId,
  title,
}: QuestionViewIconButtonProps) => {
  const navigate = useNavigate();
  return (
    <Tooltip label={`View Question ${questionId}: ${title}`}>
      <IconButton
        colorScheme="green"
        aria-label="View Question"
        value={questionId}
        onClick={() => {
          navigate(`/question/${questionId}`);
        }}
      >
        <ArrowForwardIcon />
      </IconButton>
    </Tooltip>
  );
};

export default QuestionViewIconButton;
