import { Menu, MenuButton, MenuList, MenuItem, Tooltip, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface PostEditIconButtonProps {
  postId: number;
  title: string;
}

const PostEditIconButton: React.FC<PostEditIconButtonProps> = ({ postId, title }: PostEditIconButtonProps) => {
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
            navigate(`/forum/${postId}/edit`);
          }}
        >
          Edit
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default PostEditIconButton;
