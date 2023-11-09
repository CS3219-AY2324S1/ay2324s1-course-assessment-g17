import { EditIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface PostEditIconButtonProps {
  postId: number;
  title: string;
}

const PostEditIconButton: React.FC<PostEditIconButtonProps> = ({ postId, title }: PostEditIconButtonProps) => {
  const navigate = useNavigate();
  return (
    <Tooltip label={`Edit Post ${postId}: ${title}`}>
      <IconButton
        aria-label="Edit Post"
        value={postId}
        onClick={() => {
          navigate(`/forum/${postId}/edit`);
        }}
        ml={4}
        mr={4}
      >
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};

export default PostEditIconButton;
