import { EditIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface QuestionEditIconButtonProps {
  questionId: number;
  title: string;
}

const QuestionEditIconButton: React.FC<QuestionEditIconButtonProps> = ({
  questionId,
  title,
}: QuestionEditIconButtonProps) => {
  const navigate = useNavigate();
  return (
    <Tooltip label={`Edit Question ${questionId}: ${title}`}>
      <IconButton
        aria-label="Edit Question"
        value={questionId}
        onClick={() => {
          navigate(`/question/${questionId}/edit`);
        }}
      >
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};

export default QuestionEditIconButton;
