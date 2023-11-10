import { Menu, MenuButton, MenuList, MenuItem, Tooltip, Button } from '@chakra-ui/react';
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
    <Menu>
      <Tooltip label="Options">
        <MenuButton as={Button} variant="ghost" m={2} fontSize="sm">
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
      </MenuList>
    </Menu>
  );
};

export default CommentEditIconButton;
