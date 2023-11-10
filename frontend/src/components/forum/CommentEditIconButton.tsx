import { Menu, MenuButton, MenuList, MenuItem, Tooltip, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import ForumAPI from '../../api/forum/forum';

interface CommentEditIconButtonProps {
  commentId: number;
  postId: number;
  username: string;
  onDelete: (commentId: number) => void;
}

const CommentEditIconButton: React.FC<CommentEditIconButtonProps> = ({
  commentId,
  postId,
  username,
  onDelete,
}: CommentEditIconButtonProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const handleDelete = (): void => {
    new ForumAPI()
      .deleteComment(commentId, username)
      .then(() => {
        onDelete(commentId);
        toast({
          title: 'Comment deleted.',
          description: `Comment has been deleted.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error('Error deleting comment', error);
        toast({
          title: 'Comment deletion failed.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <Menu>
      <Tooltip label="Options">
        <MenuButton as={Button} variant="ghost" fontSize="sm">
          {' '}
          ...
        </MenuButton>
      </Tooltip>
      <MenuList>
        <MenuItem
          onClick={() => {
            navigate(`/forum/${postId}/${commentId}/edit`);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDelete();
          }}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default CommentEditIconButton;
