import { DeleteIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton } from '@chakra-ui/react';
import React from 'react';
import QuestionsAPI from '../../api/questions/questions';

interface QuestionDeleteIconButtonProps {
  questionId: number;
  onDelete: (questionId: number) => void; // Callback function for handling deletion
}

const QuestionDeleteIconButton: React.FC<QuestionDeleteIconButtonProps> = ({
  questionId,
  onDelete,
}: QuestionDeleteIconButtonProps) => {
  const handleDelete = (): void => {
    new QuestionsAPI()
      .deleteQuestion(questionId)
      .then(() => {
        // Call the onDelete callback when the delete is successful
        onDelete(questionId);
      })
      .catch((error) => {
        // Handle errors (e.g., display an error message)
        console.error('Error deleting question:', error);
      });
  };

  return (
    <Tooltip label={`Delete Question ${questionId}`}>
      <IconButton
        aria-label="Delete Question"
        colorScheme="red" // Adjust the color scheme as needed
        onClick={handleDelete} // Use the handleDelete function as the onClick handler
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};

export default QuestionDeleteIconButton;
