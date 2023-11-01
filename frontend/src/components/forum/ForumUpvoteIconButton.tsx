import { TriangleUpIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton, useToast } from '@chakra-ui/react';
import React from 'react';
import ForumAPI from '../../api/forum/forum';
import { type ForumData } from '../../types/forum/forum';
import { type AxiosError } from 'axios';

interface ForumUpvoteIconButtonProps {
  postId: number;
  username: string;
  hasUpvoted: boolean;
  onUpvote: (updatedPost: ForumData) => void;
}

const ForumUpvoteIconButton: React.FC<ForumUpvoteIconButtonProps> = ({
  postId,
  username,
  hasUpvoted,
  onUpvote,
}: ForumUpvoteIconButtonProps) => {
  const toast = useToast();
  const handleUpvote = (): void => {
    new ForumAPI()
      .upvotePost(postId, username)
      .then((updatedPost) => {
        // Call the onUpvote callback when upvote is successful.
        onUpvote(updatedPost);
        console.log('Updated post:', updatedPost); // To remove later.
        toast({
          title: 'Upvoted!',
          description: 'Post has been successfully upvoted!',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 400) {
          // User has already upvoted this post.
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
          console.error('Error upvoting post', error);
          toast({
            title: 'Upvoting post failed.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      });
  };

  const buttonBgColor = hasUpvoted ? '#8cb9db' : 'transparent';

  return (
    <Tooltip label={`Upvote: This question is useful and clear.`}>
      <IconButton
        aria-label="Upvote Post"
        onClick={handleUpvote}
        _hover={{ bg: '#619cc9' }}
        bg={buttonBgColor}
        borderRadius="50%"
        border="1px solid #b4b6b8"
      >
        <TriangleUpIcon boxSize="4" />
      </IconButton>
    </Tooltip>
  );
};

export default ForumUpvoteIconButton;
