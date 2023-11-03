import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ForumAPI from '../../api/forum/forum';
import { type ForumData } from '../../types/forum/forum';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { Box, Button, Divider, Flex, Heading, Stack, useToast } from '@chakra-ui/react';
import ForumDeleteIconButton from '../../components/forum/ForumDeleteIconButton';
import ForumUpvoteButton from '../../components/forum/ForumUpvoteIconButton';
import ForumDownvoteButton from '../../components/forum/ForumDownvoteIconButton';
import { BiArrowBack, BiSolidCalendar, BiSolidUserCircle } from 'react-icons/bi';
import DOMPurify from 'dompurify';

const PostDetail: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { postId } = useParams<{ postId: string }>();
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

  return (
    <Stack paddingX={16} paddingY={8}>
      <Flex direction="column" alignItems="center">
        <Flex justifyContent="flex-start" w="100%">
          <Link to="/forum">
            <Button leftIcon={<BiArrowBack />}>Back to Forum</Button>
          </Link>
        </Flex>
        <Heading as="h1" size="xl" textAlign="center" style={{ maxWidth: '80%' }} mt={4}>
          {post?.title}
        </Heading>
        <Flex justifyContent="space-between" alignItems="center" style={{ maxWidth: '80%' }} mt={4}>
          <Flex alignItems="center" style={{ maxWidth: '50%' }} ml={4} mr={12}>
            <Box w="6" h="6" ml={2} mr={2}>
              <BiSolidUserCircle style={{ fontSize: '24px' }} />
            </Box>
            <p style={{ fontStyle: 'italic', maxWidth: '100%' }}>{post?.username}</p>
          </Flex>
          <Flex alignItems="center" style={{ maxWidth: '50%' }} ml={12} mr={4}>
            <Box w="6" h="6" ml={2} mr={2}>
              <BiSolidCalendar style={{ fontSize: '24px' }} />
            </Box>
            <p style={{ fontStyle: 'italic', maxWidth: '100%' }}>{formatPostDate(post?.createdAt)}</p>
          </Flex>
        </Flex>
        <Divider mt={4} mb={4} />
        <div
          style={{ textAlign: 'left', width: '80%' }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post?.description ?? ''),
          }}
        />
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
        {currentUser?.username === post?.username && (
          <ForumDeleteIconButton
            postId={postIdAsNumber}
            username={currentUser?.username ?? ''}
            onDelete={handlePostDeletion}
          />
        )}
      </Flex>
    </Stack>
  );
};

export default PostDetail;
