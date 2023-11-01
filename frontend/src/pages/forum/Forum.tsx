import { Button, Flex, Input, Stack, Text } from '@chakra-ui/react';
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
import ForumUpvoteButton from '../../components/forum/ForumUpvoteIconButton';
import ForumDownvoteButton from '../../components/forum/ForumDownvoteIconButton';

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumData[]>([]);

  const currentUser = useAppSelector(selectUser);

  const fetchForumPosts = async (): Promise<void> => {
    try {
      const forumAPI = new ForumAPI();
      const forumPosts = await forumAPI.viewPosts();
      setPosts(forumPosts);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
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

  // Calculate upvote status for each post.
  const calculateUpvoteStatus = (post: ForumData): boolean => {
    // Check if the user's username is in the upvotes array.
    return post.upvotes.includes(currentUser?.username ?? '');
  };

  const handlePostUpvote = (updatedPost: ForumData): void => {
    const updatedPosts = posts.map((post) => (post.id === updatedPost.id ? updatedPost : post));
    setPosts(updatedPosts);
  };

  return (
    <Stack paddingX={16} paddingY={8}>
      <Flex direction="column" alignItems="center">
        <Flex justifyContent="flex-start" w="100%">
          <Link to="/">
            <Button leftIcon={<BiArrowBack />}>Back</Button>
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
        <Stack spacing={8}>
          {posts?.map((post) => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
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
              <ForumUpvoteButton
                postId={post.id}
                username={currentUser?.username ?? ''}
                hasUpvoted={calculateUpvoteStatus(post)}
                onUpvote={handlePostUpvote}
              />
              <ForumDownvoteButton
                postId={post.id}
                username={currentUser?.username ?? ''}
                onDownvote={handlePostUpvote}
              />
            </div>
          ))}
        </Stack>
      </Flex>
    </Stack>
  );
};

export default Forum;
