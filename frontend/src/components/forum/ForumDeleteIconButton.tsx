import { DeleteIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton, useToast } from '@chakra-ui/react';
import React from 'react';
import ForumAPI from '../../api/forum/forum';

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
    <Tooltip label={`Delete Post ${postId}`}>
      <IconButton aria-label="Delete Post" onClick={handleDelete} _hover={{ bg: 'transparent' }} bg="transparent">
        <DeleteIcon boxSize="4" />
      </IconButton>
    </Tooltip>
  );
};

export default ForumDeleteIconButton;
