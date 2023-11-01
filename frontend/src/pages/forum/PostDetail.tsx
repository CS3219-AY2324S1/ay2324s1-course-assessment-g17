import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ForumAPI from '../../api/forum/forum';
import { type ForumData } from '../../types/forum/forum';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { useToast } from '@chakra-ui/react';
import ForumDeleteIconButton from '../../components/forum/ForumDeleteIconButton';
import ForumUpvoteButton from '../../components/forum/ForumUpvoteIconButton';
import ForumDownvoteButton from '../../components/forum/ForumDownvoteIconButton';

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
    <div>
      <div>
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
      </div>
    </div>
  );
};

export default PostDetail;
