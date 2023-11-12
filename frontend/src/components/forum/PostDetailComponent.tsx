import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ForumAPI from '../../api/forum/forum';
import { type ForumData } from '../../types/forum/forum';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { Avatar, Button, Divider, Stack, Flex, HStack, Heading, VStack, useToast, Text } from '@chakra-ui/react';
import ForumUpvoteButton from './ForumUpvoteIconButton';
import ForumDownvoteButton from './ForumDownvoteIconButton';
import { BiArrowBack } from 'react-icons/bi';
import DOMPurify from 'dompurify';
import PostEditIconButton from './PostEditIconButton';

interface PostDetailComponentProps {
  postId: string;
}

const PostDetailComponent: React.FC<PostDetailComponentProps> = ({ postId }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [post, setPost] = useState<ForumData | null>(null);

  const currentUser = useAppSelector(selectUser);

  let postIdAsNumber: number;
  if (postId !== undefined) {
    postIdAsNumber = parseInt(postId);
  } else {
    throw new Error('ID of post is undefined');
  }

  const fetchPostDetail = async (): Promise<void> => {
    try {
      const forumAPI = new ForumAPI();
      const postData = await forumAPI.viewPost(postIdAsNumber);
      setPost(postData);
    } catch (error) {
      console.error('Error fetching post details:', error);
      toast({
        title: 'Error fetching post details.',
        description: 'Please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchPostDetail().catch((error) => {
      console.error('Error fetching post detail:', error);
      navigate('/404');
    });
  }, [postId]);

  const formatPostDate = (date: Date | undefined): string => {
    if (date !== undefined) {
      return new Date(date).toLocaleString('en-SG', { timeZone: 'Asia/Singapore', hour12: false });
    }
    return '';
  };

  const handlePostDeletion = (): void => {
    navigate('/forum');
  };

  // Calculate upvote status for each post.
  const calculateUpvoteStatus = (post: ForumData): boolean => {
    // Check if the user's username is in the upvotes array.
    return post.upvotes.includes(currentUser?.username ?? '');
  };

  const handlePostUpvote = (updatedPost: ForumData): void => {
    setPost(updatedPost);
  };

  const ellipsisStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <>
      <Flex direction="column" alignItems="center">
        <Flex justifyContent="flex-start" w="100%">
          <Link to="/forum">
            <Button mt={4} ml={4} leftIcon={<BiArrowBack />}>
              Back to Forum
            </Button>
          </Link>
        </Flex>
        <Heading as="h1" size="xl" textAlign="left" style={{ maxWidth: '100%' }} mt={4}>
          {post?.title}
        </Heading>
        <Stack alignItems="center" style={{ width: '100%' }}>
          <Flex direction="column" alignItems="left" style={{ width: '85%' }}>
            <HStack justifyContent="space-between" alignItems="left" style={{ width: '80%' }} mt={4}>
              <Flex direction="column" style={{ overflow: 'hidden' }} flex="1">
                <HStack>
                  <VStack alignItems="start">
                    <HStack>
                      <Avatar size="sm" name={post?.username} />
                      <Text style={{ fontWeight: 'bold', whiteSpace: 'nowrap', ...ellipsisStyle }}>
                        {post?.username}
                      </Text>
                      <Text style={{ fontStyle: 'italic', color: 'gray', fontSize: 'small' }}>
                        • {formatPostDate(post?.createdAt)}
                      </Text>
                    </HStack>
                  </VStack>
                  {currentUser?.username === post?.username && (
                    <PostEditIconButton
                      username={currentUser?.username ?? ''}
                      onDelete={handlePostDeletion}
                      postId={postIdAsNumber}
                      title={post?.title ?? ''}
                    />
                  )}
                </HStack>
              </Flex>
            </HStack>
          </Flex>
        </Stack>
        <Divider mt={4} mb={4} />
        <HStack style={{ width: '80%', alignItems: 'flex-start' }}>
          <VStack style={{ width: '10%', justifyContent: 'flex-start' }}>
            <ForumUpvoteButton
              postId={postIdAsNumber}
              username={currentUser?.username ?? ''}
              hasUpvoted={post !== null ? calculateUpvoteStatus(post) : false}
              onUpvote={handlePostUpvote}
            />
            <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{post?.upvotes.length}</p>
            <ForumDownvoteButton
              postId={postIdAsNumber}
              username={currentUser?.username ?? ''}
              onDownvote={handlePostUpvote}
            />
          </VStack>
          <div
            style={{ width: '80%' }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post?.description ?? ''),
            }}
          />
        </HStack>
      </Flex>
    </>
  );
};

export default PostDetailComponent;
