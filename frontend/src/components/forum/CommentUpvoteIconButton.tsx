import { TriangleUpIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton, useToast, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import ForumAPI from '../../api/forum/forum';
import { type Comment } from '../../types/forum/forum';
import { type AxiosError } from 'axios';

interface CommentUpvoteIconButtonProps {
  commentId: number;
  username: string;
  hasUpvoted: boolean;
  onUpvote: (updatedComment: Comment) => void;
}

const CommentUpvoteIconButton: React.FC<CommentUpvoteIconButtonProps> = ({
  commentId,
  username,
  hasUpvoted,
  onUpvote,
}: CommentUpvoteIconButtonProps) => {
  const toast = useToast();
  const handleUpvote = (): void => {
    new ForumAPI()
      .upvoteComment(commentId, username)
      .then((updatedComment) => {
        // Call the onUpvote callback when upvote is successful.
        onUpvote(updatedComment);
        console.log('Updated comment:', updatedComment); // To remove later.
        toast({
          title: 'Upvoted!',
          description: 'Comment has been successfully upvoted!',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 400) {
          // User has already upvoted this comment.
          console.error('No multiple upvotes', error);
          toast({
            title: 'No multiple upvotes!',
            description: 'You can only upvote once.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        } else {
          // Handle other errors (e.g., display a general error message).
          console.error('Error upvoting comment', error);
          toast({
            title: 'Upvoting comment failed.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      });
  };

  const buttonBgColor = hasUpvoted ? useColorModeValue('#4bd6c8', '#0c9c9c') : 'transparent';

  return (
    <Tooltip label={`Upvote: This comment is useful and clear.`}>
      <IconButton
        aria-label="Upvote Comment"
        onClick={handleUpvote}
        _hover={{ bg: useColorModeValue('#0a9dad', '#025361') }}
        bg={buttonBgColor}
        borderRadius="50%"
        border="1px solid #b4b6b8"
      >
        <TriangleUpIcon boxSize="4" />
      </IconButton>
    </Tooltip>
  );
};

export default CommentUpvoteIconButton;
