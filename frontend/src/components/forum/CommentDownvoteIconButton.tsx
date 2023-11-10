import { Tooltip, IconButton, useToast, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import ForumAPI from '../../api/forum/forum';
import { type Comment } from '../../types/forum/forum';
import { type AxiosError } from 'axios';
import { FaArrowDown } from 'react-icons/fa6';

interface CommentDownvoteIconButtonProps {
  commentId: number;
  username: string;
  onDownvote: (updatedComment: Comment) => void;
}

const CommentDownvoteIconButton: React.FC<CommentDownvoteIconButtonProps> = ({
  commentId,
  username,
  onDownvote,
}: CommentDownvoteIconButtonProps) => {
  const toast = useToast();
  const handleDownvote = (): void => {
    new ForumAPI()
      .downvoteComment(commentId, username)
      .then((updatedComment) => {
        // Call the onDownvote callback when downvote is successful.
        onDownvote(updatedComment);
        console.log('Updated comment:', updatedComment); // To remove later.
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
          console.error('Error downvoting comment', error);
          toast({
            title: 'Downvoting comment failed.',
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
        aria-label="Downvote Comment"
        icon={<FaArrowDown />}
        onClick={handleDownvote}
        _hover={{ bg: useColorModeValue('#0a9dad', '#025361') }}
        bg="transparent"
        borderRadius="50%"
        border="1px solid #b4b6b8"
      />
    </Tooltip>
  );
};

export default CommentDownvoteIconButton;
