import { TriangleDownIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton, useToast, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import ForumAPI from '../../api/forum/forum';
import { type ForumData } from '../../types/forum/forum';
import { type AxiosError } from 'axios';

interface ForumDownvoteIconButtonProps {
  postId: number;
  username: string;
  onDownvote: (updatedPost: ForumData) => void;
}

const ForumDownvoteIconButton: React.FC<ForumDownvoteIconButtonProps> = ({
  postId,
  username,
  onDownvote,
}: ForumDownvoteIconButtonProps) => {
  const toast = useToast();
  const handleDownvote = (): void => {
    new ForumAPI()
      .downvotePost(postId, username)
      .then((updatedPost) => {
        // Call the onDownvote callback when downvote is successful.
        onDownvote(updatedPost);
        console.log('Updated post:', updatedPost); // To remove later.
        toast({
          title: 'Upvote removed!',
          description: 'Your upvote has been successfully removed!',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 400) {
          // User has not upvoted before.
          console.error('No previous upvote', error);
          toast({
            title: 'Failed to remove upvote!',
            description: 'You have not upvoted before.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        } else {
          // Handle other errors (e.g., display a general error message).
          console.error('Error downvoting post', error);
          toast({
            title: 'Downvoting post failed.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      });
  };

  return (
    <Tooltip label={`Downvote: Remove my previous upvote.`}>
      <IconButton
        aria-label="Downvote Post"
        onClick={handleDownvote}
        _hover={{ bg: useColorModeValue('#0a9dad', '#025361') }}
        bg="transparent"
        borderRadius="50%"
        border="1px solid #b4b6b8"
      >
        <TriangleDownIcon boxSize="4" />
      </IconButton>
    </Tooltip>
  );
};

export default ForumDownvoteIconButton;
