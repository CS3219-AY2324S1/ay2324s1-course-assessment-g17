import { Button, Flex, Input, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IconWithText from '../../components/content/IconWithText';
import { AddIcon } from '@chakra-ui/icons';
import { MdForum } from 'react-icons/md';
import { BiArrowBack } from 'react-icons/bi';
import { type ForumData } from '../../types/forum/forum';
import ForumAPI from '../../api/forum/forum';
import ForumDeleteIconButton from '../../components/forum/ForumDeleteIconButton';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';

const Forum: React.FC = () => {
  const toast = useToast();

  const [posts, setPosts] = useState<ForumData[]>([]);

  const currentUser = useAppSelector(selectUser);

  const fetchForumPosts = async (): Promise<void> => {
    try {
      const forumAPI = new ForumAPI();
      const forumPosts = await forumAPI.viewPosts();
      setPosts(forumPosts);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      toast({
        title: 'Error fetching forum posts.',
        description: 'Please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchForumPosts().catch((error) => {
      console.error('Error fetching forum posts:', error);
    });
  }, []);

  const handlePostDeletion = (postId: number): void => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  const cardStyle = {
    border: '1px solid #ccc',
    padding: '16px',
    marginBottom: '16px',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    width: '80%',
    maxWidth: '600px',
    minWidth: '200px',
    margin: '0 auto',
  };

  return (
    <Stack paddingX={16} paddingY={8}>
      <Flex direction="column" alignItems="center">
        <Flex justifyContent="flex-start" w="100%">
          <Link to="/">
            <Button leftIcon={<BiArrowBack />}>Back to Home</Button>
          </Link>
        </Flex>
        <IconWithText text="Forum" icon={<MdForum size={40} />} fontSize="4xl" fontWeight="bold" />
        <Text fontSize="xl" fontWeight="bold" textAlign="center" fontStyle="italic" color="gray.600">
          Get code help and start discussions!
        </Text>
        <Flex justifyContent="space-between" alignItems="center" w="85%" style={{ marginTop: '30px' }}>
          {/* Placeholder for search bar */}
          <Input placeholder="Search post..." style={{ marginRight: '10px' }} />
          <Link to="/forum/new-post">
            <Button leftIcon={<AddIcon />} colorScheme="teal">
              New Post
            </Button>
          </Link>
        </Flex>
        <Stack padding={8} spacing={8} w="100%">
          {posts?.map((post) => (
            <div key={post.id} style={cardStyle}>
              <Link
                to={`/forum/${post.id}`}
                style={{ fontWeight: 'bold' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#4077CC';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'inherit';
                }}
              >
                {post.title}
              </Link>
              <p>Posted by: {post.username}</p>
              <p>
                Posted on:{' '}
                {new Date(post.createdAt).toLocaleString('en-SG', { timeZone: 'Asia/Singapore', hour12: false })}
              </p>
              <p>Upvotes: {post.upvotes.length}</p>
              {currentUser?.username === post.username && (
                <ForumDeleteIconButton
                  postId={post.id}
                  username={currentUser?.username}
                  onDelete={handlePostDeletion}
                />
              )}
            </div>
          ))}
        </Stack>
      </Flex>
    </Stack>
  );
};

export default Forum;
