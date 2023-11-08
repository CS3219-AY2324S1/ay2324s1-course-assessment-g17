import { useToast } from '@chakra-ui/react';
import React from 'react';
import ForumAPI from '../../api/forum/forum';
import ConfirmationDialog from '../../components/content/ConfirmationDialog';

interface CommentDeleteIconButtonProps {
  commentId: number;
  username: string;
  onDelete: (commentId: number) => void;
}

const CommentDeleteIconButton: React.FC<CommentDeleteIconButtonProps> = ({
  commentId,
  username,
  onDelete,
}: CommentDeleteIconButtonProps) => {
  const toast = useToast();
  const handleDelete = (): void => {
    new ForumAPI()
      .deleteComment(commentId, username)
      .then(() => {
        // Call the onDelete callback when the delete is successful
        onDelete(commentId);
      })
      .catch((error) => {
        // Handle errors (e.g., display an error message)
        console.error('Error deleting comment', error);
        toast({
          title: 'Comment deletion failed.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <ConfirmationDialog
      dialogHeader={'Delete Comment'}
      dialogBody={'Are you sure you want to delete your comment? This action is irreversible!'}
      mainButtonLabel={'Delete my comment'}
      rightButtonLabel={'Yes, delete my comment permanently!'}
      onConfirm={handleDelete}
      mainButtonProps={{ colorScheme: 'gray' }}
    />
  );
};

export default CommentDeleteIconButton;
