import { EditIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface PostEditIconButtonProps {
  postId: number;
}

const PostEditIconButton: React.FC<PostEditIconButtonProps> = ({
  postId,
}: PostEditIconButtonProps) => {
  const navigate = useNavigate();

  return (
    <Tooltip label={'Edit Post'}>
      <IconButton
        aria-label="Edit Comment"
        onClick={() => {
          navigate(`/forum/${postId}/edit`);
        }}
        ml={4}
      >
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};

export default PostEditIconButtonProps;
