import { Menu, MenuButton, MenuList, MenuItem, Tooltip, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import ForumAPI from '../../api/forum/forum';

interface PostEditIconButtonProps {
  postId: number;
  title: string;
  username: string;
  onDelete: (postId: number) => void;
}

const PostEditIconButton: React.FC<PostEditIconButtonProps> = ({
  postId,
  title,
  username,
  onDelete,
}: PostEditIconButtonProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const handleDelete = (): void => {
    new ForumAPI()
      .deletePost(postId, username)
      .then(() => {
        onDelete(postId);
        toast({
          title: 'Post deleted.',
          description: `Post "${title}" has been deleted.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error('Error deleting post', error);
        toast({
          title: 'Post deletion failed.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
  };

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

export default PostEditIconButton;
