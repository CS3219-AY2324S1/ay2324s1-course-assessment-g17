import { EditIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface CommentEditIconButtonProps {
  commentId: number;
  postId: number;
}

const CommentEditIconButton: React.FC<CommentEditIconButtonProps> = ({
  commentId,
  postId,
}: CommentEditIconButtonProps) => {
  const navigate = useNavigate();

  return (
    <Tooltip label={'Edit Comment'}>
      <IconButton
        aria-label="Edit Comment"
        onClick={() => {
          navigate(`/forum/${postId}/${commentId}/edit`);
        }}
        ml={4}
      >
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};

export default CommentEditIconButton;
