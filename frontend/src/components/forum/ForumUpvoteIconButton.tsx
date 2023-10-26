import { TriangleUpIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton, useToast } from '@chakra-ui/react';
import React from 'react';
import ForumAPI from '../../api/forum/forum';
import { type ForumData } from '../../types/forum/forum';

interface ForumUpvoteIconButtonProps {
  postId: number;
  onUpvote: (updatedPost: ForumData) => void;
}

const ForumUpvoteIconButton: React.FC<ForumUpvoteIconButtonProps> = ({
  postId,
  onUpvote,
}: ForumUpvoteIconButtonProps) => {
  const toast = useToast();
  const handleUpvote = (): void => {
    new ForumAPI()
      .upvotePost(postId)
      .then((updatedPost) => {
        // Call the onUpvote callback when upvote is successful.
        onUpvote(updatedPost);
        console.log('Updated post:', updatedPost);
      })
      .catch((error) => {
        // Handle errors (e.g., display an error message)
        console.error('Error upvoting post', error);
        toast({
          title: 'Upvoting post failed.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <Tooltip label={`Upvote Post ${postId}`}>
      <IconButton aria-label="Upvote Post" onClick={handleUpvote} _hover={{ bg: 'transparent' }} bg="transparent">
        <TriangleUpIcon boxSize="3" />
      </IconButton>
    </Tooltip>
  );
};

export default ForumUpvoteIconButton;
