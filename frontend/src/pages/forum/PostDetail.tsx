import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ForumAPI from '../../api/forum/forum';
import { type ForumData } from '../../types/forum/forum';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { Button, Flex, Stack, useToast } from '@chakra-ui/react';
import ForumDeleteIconButton from '../../components/forum/ForumDeleteIconButton';
import ForumUpvoteButton from '../../components/forum/ForumUpvoteIconButton';
import ForumDownvoteButton from '../../components/forum/ForumDownvoteIconButton';
import { BiArrowBack } from 'react-icons/bi';

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
        <h1>{post?.title}</h1>
        <p>{post?.description}</p>
        <p>Posted by: {post?.username}</p>
        <p>Posted on: {formatPostDate(post?.createdAt)}</p>
        <p>Upvotes: {post?.upvotes.length}</p>
        {currentUser?.username === post?.username && (
          <ForumDeleteIconButton
            postId={postIdAsNumber}
            username={currentUser?.username ?? ''}
            onDelete={handlePostDeletion}
          />
        )}
        <ForumUpvoteButton
          postId={postIdAsNumber}
          username={currentUser?.username ?? ''}
          hasUpvoted={post !== null ? calculateUpvoteStatus(post) : false}
          onUpvote={handlePostUpvote}
        />
        <ForumDownvoteButton
          postId={postIdAsNumber}
          username={currentUser?.username ?? ''}
          onDownvote={handlePostUpvote}
        />
      </Flex>
    </Stack>
  );
};

export default PostDetail;
