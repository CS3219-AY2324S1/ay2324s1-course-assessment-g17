import { useToast } from '@chakra-ui/react';
import React from 'react';
import ForumAPI from '../../api/forum/forum';
import ConfirmationDialog from '../../components/content/ConfirmationDialog';

interface ForumDeleteIconButtonProps {
  postId: number;
  username: string;
  onDelete: (postId: number) => void;
}

const ForumDeleteIconButton: React.FC<ForumDeleteIconButtonProps> = ({
  postId,
  username,
  onDelete,
}: ForumDeleteIconButtonProps) => {
  const toast = useToast();
  const handleDelete = (): void => {
    new ForumAPI()
      .deletePost(postId, username)
      .then(() => {
        // Call the onDelete callback when the delete is successful
        onDelete(postId);
      })
      .catch((error) => {
        // Handle errors (e.g., display an error message)
        console.error('Error deleting post', error);
        toast({
          title: 'Post deletion failed.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <ConfirmationDialog
      dialogHeader={'Delete Post'}
      dialogBody={'Are you sure you want to delete your post? This action is irreversible!'}
      mainButtonLabel={'Delete post'}
      rightButtonLabel={'Yes, delete my post permanently!'}
      onConfirm={handleDelete}
      mainButtonProps={{ colorScheme: 'gray' }}
    />
  );
};

export default ForumDeleteIconButton;
