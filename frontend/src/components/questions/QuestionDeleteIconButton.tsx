import { CloseIcon } from '@chakra-ui/icons';
import {
  Tooltip,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
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
        toast({
          title: 'Question deletion failed.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Tooltip label={`Delete Question ${questionId}`}>
        <IconButton aria-label="Delete Question" onClick={onOpen} _hover={{ bg: 'transparent' }} bg="transparent">
          <CloseIcon boxSize="3" />
        </IconButton>
      </Tooltip>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent minW={{ lg: '700px' }} padding={2}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete question?
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete question {questionId}? This action is irreversible!
            </AlertDialogBody>
            <AlertDialogFooter mt={2}>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleDelete} ml={3} colorScheme="blue">
                Delete Question
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default QuestionDeleteIconButton;
