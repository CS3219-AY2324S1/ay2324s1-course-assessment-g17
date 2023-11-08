import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostDetailComponent from '../../components/forum/PostDetailComponent';
import { type Comment } from '../../types/forum/forum';
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  useToast,
  useColorModeValue,
  VStack,
  Divider,
} from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import CommentEditIconButton from '../../components/forum/CommentEditIconButton';
import CommentDeleteIconButton from '../../components/forum/CommentDeleteIconButton';
import CommentUpvoteButton from '../../components/forum/CommentUpvoteIconButton';
import CommentDownvoteButton from '../../components/forum/CommentDownvoteIconButton';
import { AddIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { BiSolidCalendar, BiSolidUserCircle } from 'react-icons/bi';
import ForumAPI from '../../api/forum/forum';
import ForumPostsPagination from '../../components/forum/ForumPostsPagination';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const toast = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
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
      // Default: sort the posts by creation date, from newest to oldest.
      postComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(postComments);
      setFilteredComments(postComments); // Initially, filtered posts are the same as all posts.
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

  // Calculate the range of posts to display based on the current page and posts per page.
  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const currentComments = filteredComments.slice(startIndex, endIndex); // Use filteredPosts for rendering.

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  // Handle live search as the user types.
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    // Filter posts based on the search term.
    const filtered = comments.filter((comment) => comment.content.toLowerCase().includes(newSearchTerm.toLowerCase()));

    setFilteredComments(filtered);
  };

  const handleClearSearch = (): void => {
    setSearchTerm('');
    fetchComments().catch((error) => {
      console.error('Error fetching comments:', error);
    });
  };

  // Handle sorting.
  const handleSort = (option: 'newest' | 'mostVotes'): void => {
    setSortOption(option);

    // Sort the posts based on the selected option.
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

  // Calculate upvote status for each post.
  const calculateUpvoteStatus = (comment: Comment): boolean => {
    // Check if the user's username is in the upvotes array.
    return comment.upvotes.includes(currentUser?.username ?? '');
  };

  const handleCommentUpvote = (updatedComment: Comment): void => {
    const updatedComments = comments.filter((c) => c.id !== updatedComment.id);
    const updatedFilteredComments = comments.filter((c) => c.id !== updatedComment.id);
    setComments([...updatedComments, updatedComment]);

    // Sort the posts based on the selected option.
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

    // Sort the posts based on the selected option.
    const sorted = [...updatedFilteredComments];

    if (sortOption === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'mostVotes') {
      sorted.sort((a, b) => b.upvotes.length - a.upvotes.length);
    }

    setFilteredComments(sorted);
  };

  const cardStyle = {
    border: '1px solid #ccc',
    padding: '20px 32px',
    marginBottom: '16px',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    width: '85%',
    // maxWidth: '800px',
    // minWidth: '200px',
    margin: '0 auto',
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
            {/* Input for live search */}
            <InputGroup minWidth="fit-content" margin={4}>
              <InputLeftElement paddingLeft={8} pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                paddingLeft={16}
                type="text"
                placeholder="Search Comments..."
                _placeholder={{ color: useColorModeValue('gray.500', 'gray.400'), opacity: 1 }}
                value={searchTerm ?? ''}
                onChange={handleSearch}
              />
              <InputRightElement
                _hover={{ cursor: 'pointer', color: 'gray.600' }}
                color="gray.400"
                _active={{ transform: 'scale(0.9)' }}
                onClick={handleClearSearch}
              >
                <CloseIcon />
              </InputRightElement>
            </InputGroup>
            <Link to={newCommentLink}>
              <Button leftIcon={<AddIcon />} colorScheme="teal">
                New Comment
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
          {/*  */}
          <Stack padding={8} spacing={8} w="100%">
            {currentComments.map((comment) => (
              <Flex key={comment.id} direction="column" alignItems="center" style={cardStyle}>
                <Flex justifyContent="space-between" alignItems="center" style={{ maxWidth: '80%' }} mt={4}>
                  <Flex direction="column" style={{ overflow: 'hidden' }} flex="1">
                    <HStack>
                      <Box w="4" h="4">
                        <BiSolidUserCircle />
                      </Box>
                      <Text style={{ fontStyle: 'italic', whiteSpace: 'nowrap', ...ellipsisStyle }}>
                        {comment.username} commented...
                      </Text>
                    </HStack>
                    <HStack>
                      <Box w="4" h="4">
                        <BiSolidCalendar />
                      </Box>
                      <Text style={{ fontStyle: 'italic' }}>{formatCommentDate(comment.createdAt)}</Text>
                    </HStack>
                  </Flex>
                  {currentUser?.username === comment.username && (
                    <>
                      <CommentEditIconButton commentId={comment.id} postId={postIdAsNumber} />
                      <CommentDeleteIconButton
                        commentId={comment.id}
                        username={currentUser?.username ?? ''}
                        onDelete={handleCommentDeletion}
                      />
                    </>
                  )}
                </Flex>
                <Divider mt={4} mb={4} />
                <HStack style={{ width: '80%', alignItems: 'flex-start' }}>
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
                    style={{ width: '80%' }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(comment?.content ?? ''),
                    }}
                  />
                </HStack>
              </Flex>
            ))}
          </Stack>
          {/*  */}
          {/* Pagination component using the filteredPosts length */}
          <ForumPostsPagination
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
