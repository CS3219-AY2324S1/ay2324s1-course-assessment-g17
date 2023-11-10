import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostDetailComponent from '../../components/forum/PostDetailComponent';
import { type Comment } from '../../types/forum/forum';
import { Box, Button, Flex, HStack, Stack, Text, useToast, VStack, Divider } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import CommentEditIconButton from '../../components/forum/CommentEditIconButton';
import CommentDeleteIconButton from '../../components/forum/CommentDeleteIconButton';
import CommentUpvoteButton from '../../components/forum/CommentUpvoteIconButton';
import CommentDownvoteButton from '../../components/forum/CommentDownvoteIconButton';
import { AddIcon } from '@chakra-ui/icons';
import { BiSolidUserCircle } from 'react-icons/bi';
import ForumAPI from '../../api/forum/forum';
import ForumPostsPagination from '../../components/forum/ForumPostsPagination';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const toast = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [sortOption, setSortOption] = useState<'newest' | 'mostVotes'>('newest'); // Default sorting is "Newest to Oldest"
  const commentsPerPage = 5;
  const newCommentLink = 'new-comment';

  let postIdAsNumber: number;
  if (postId !== undefined) {
    postIdAsNumber = parseInt(postId);
  } else {
    throw new Error('ID of post is undefined');
  }

  const currentUser = useAppSelector(selectUser);

  const fetchComments = async (): Promise<void> => {
    try {
      const forumAPI = new ForumAPI();
      const postComments = await forumAPI.viewComments(postIdAsNumber);
      // Default: sort the comments by creation date, from newest to oldest.
      postComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(postComments);
      setFilteredComments(postComments); // Initially, filtered comments are the same as all comments.
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error fetching comments.',
        description: 'Please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  // Calculate the range of comments to display based on the current page and comments per page.
  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const currentComments = filteredComments.slice(startIndex, endIndex); // Use filteredComments for rendering.

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  // Handle sorting.
  const handleSort = (option: 'newest' | 'mostVotes'): void => {
    setSortOption(option);

    // Sort the comments based on the selected option.
    const sorted = [...filteredComments];

    if (option === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (option === 'mostVotes') {
      sorted.sort((a, b) => b.upvotes.length - a.upvotes.length);
    }

    setFilteredComments(sorted);
  };

  useEffect(() => {
    fetchComments().catch((error) => {
      console.error('Error fetching comments:', error);
    });
  }, []);

  const formatCommentDate = (date: Date | undefined): string => {
    if (date !== undefined) {
      return new Date(date).toLocaleString('en-SG', { timeZone: 'Asia/Singapore', hour12: false });
    }
    return '';
  };

  // Calculate upvote status for each comment.
  const calculateUpvoteStatus = (comment: Comment): boolean => {
    // Check if the user's username is in the upvotes array.
    return comment.upvotes.includes(currentUser?.username ?? '');
  };

  const handleCommentUpvote = (updatedComment: Comment): void => {
    const updatedComments = comments.filter((c) => c.id !== updatedComment.id);
    const updatedFilteredComments = comments.filter((c) => c.id !== updatedComment.id);
    setComments([...updatedComments, updatedComment]);

    // Sort the comments based on the selected option.
    const sorted = [...updatedFilteredComments, updatedComment];

    if (sortOption === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'mostVotes') {
      sorted.sort((a, b) => b.upvotes.length - a.upvotes.length);
    }

    setFilteredComments(sorted);
  };

  const handleCommentDeletion = (deletedCommentId: number): void => {
    const updatedComments = comments.filter((c) => c.id !== deletedCommentId);
    const updatedFilteredComments = comments.filter((c) => c.id !== deletedCommentId);
    setComments([...updatedComments]);

    // Sort the comments based on the selected option.
    const sorted = [...updatedFilteredComments];

    if (sortOption === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'mostVotes') {
      sorted.sort((a, b) => b.upvotes.length - a.upvotes.length);
    }

    setFilteredComments(sorted);
  };

  const ellipsisStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <>
      <PostDetailComponent postId={postId} />
      <Stack paddingX={16} paddingY={8}>
        <Flex direction="column" alignItems="center">
          <Flex justifyContent="space-between" alignItems="center" w="85%" style={{ marginTop: '30px' }}>
            <Link to={newCommentLink}>
              <Button leftIcon={<AddIcon />} colorScheme="gray">
                Add a Comment
              </Button>
            </Link>
          </Flex>
          {/* Sorting buttons */}
          <HStack spacing={4}>
            <Button
              colorScheme={sortOption === 'newest' ? 'teal' : 'gray'}
              onClick={() => {
                handleSort('newest');
              }}
            >
              Newest to Oldest
            </Button>
            <Button
              colorScheme={sortOption === 'mostVotes' ? 'teal' : 'gray'}
              onClick={() => {
                handleSort('mostVotes');
              }}
            >
              Most Votes
            </Button>
          </HStack>
          <Stack padding={8} spacing={8} w="100%">
            {currentComments.map((comment) => (
              <Flex key={comment.id} direction="column" alignItems="center">
                <HStack justifyContent="space-between" alignItems="center" style={{ width: '80%' }} mt={4}>
                  <Flex direction="column" style={{ overflow: 'hidden' }} flex="1">
                    <HStack>
                      <VStack alignItems="start">
                        <HStack>
                          <Box w="4" h="4">
                            <BiSolidUserCircle />
                          </Box>
                          <Text style={{ fontStyle: 'italic', whiteSpace: 'nowrap', ...ellipsisStyle }}>
                            {comment.username}
                          </Text>
                          <Text style={{ fontStyle: 'italic', color: 'gray', fontSize: 'small' }}>
                            • {formatCommentDate(comment.createdAt)}
                          </Text>
                        </HStack>
                      </VStack>
                      {currentUser?.username === comment.username && (
                        <CommentEditIconButton commentId={comment.id} postId={postIdAsNumber} />
                      )}
                    </HStack>
                  </Flex>
                  {currentUser?.username === comment.username && (
                    <CommentDeleteIconButton
                      commentId={comment.id}
                      username={currentUser?.username ?? ''}
                      onDelete={handleCommentDeletion}
                    />
                  )}
                </HStack>
                <Divider mt={4} mb={4} />
                <HStack style={{ width: '100%', alignItems: 'flex-start' }}>
                  <VStack style={{ width: '10%', justifyContent: 'flex-start' }}>
                    <CommentUpvoteButton
                      commentId={comment.id}
                      username={currentUser?.username ?? ''}
                      hasUpvoted={comment !== null ? calculateUpvoteStatus(comment) : false}
                      onUpvote={handleCommentUpvote}
                    />
                    <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{comment?.upvotes.length}</p>
                    <CommentDownvoteButton
                      commentId={comment.id}
                      username={currentUser?.username ?? ''}
                      onDownvote={handleCommentUpvote}
                    />
                  </VStack>
                  <div
                    style={{ width: '90%' }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(comment?.content ?? ''),
                    }}
                  />
                </HStack>
              </Flex>
            ))}
          </Stack>
          {/* Pagination component using the filteredComments length */}
          <ForumPostsPagination
            type={'comment'}
            currentPage={currentPage}
            totalItems={filteredComments.length}
            itemsPerPage={commentsPerPage}
            onPageChange={handlePageChange}
          />
        </Flex>
      </Stack>
    </>
  );
};

export default PostDetail;
