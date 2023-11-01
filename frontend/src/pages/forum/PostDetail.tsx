import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ForumAPI from '../../api/forum/forum';
import { type ForumData } from '../../types/forum/forum';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import { useToast } from '@chakra-ui/react';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumData | null>(null);
  const toast = useToast();
  const currentUser = useAppSelector(selectUser);

  const fetchPostDetail = async (): Promise<void> => {
    try {
      let postIdAsNumber: number;
      if (postId !== undefined) {
        postIdAsNumber = parseInt(postId);
      } else {
        throw new Error('ID of post is undefined');
      }
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

  return (
    <div>
      <div>
        <h1>{post?.title}</h1>
        <p>{post?.description}</p>
        <p>Posted by: {post?.username}</p>
        <p>Posted on: {formatPostDate(post?.createdAt)}</p>
        <p>Upvotes: {post?.upvotes.length}</p>
      </div>
    </div>
  );
};

export default PostDetail;
