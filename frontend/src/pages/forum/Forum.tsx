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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IconWithText from '../../components/content/IconWithText';
import { AddIcon, CloseIcon, SearchIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { MdForum } from 'react-icons/md';
import { BiArrowBack, BiSolidCalendar, BiSolidCommentDetail, BiSolidUserCircle } from 'react-icons/bi';
import { type ForumData } from '../../types/forum/forum';
import ForumAPI from '../../api/forum/forum';
import ForumPostsPagination from '../../components/forum/ForumPostsPagination';

const Forum: React.FC = () => {
  const toast = useToast();

  const [posts, setPosts] = useState<ForumData[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<ForumData[]>([]);
  const [sortOption, setSortOption] = useState('newest'); // Default sorting is "Newest to Oldest"
  const postsPerPage = 5;

  const fetchForumPosts = async (): Promise<void> => {
    try {
      const forumAPI = new ForumAPI();
      const forumPosts = await forumAPI.viewPosts();
      const postsWithCommentCounts = await Promise.all(
        forumPosts.map(async (post) => {
          const comments = await forumAPI.viewComments(post.id);
          return { ...post, commentCount: comments.length };
        }),
      );

      // Default: sort the posts by creation date, from newest to oldest.
      postsWithCommentCounts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(postsWithCommentCounts);
      setFilteredPosts(postsWithCommentCounts); // Initially, filtered posts are the same as all posts.

      // Update comment counts state
      const commentCountsObject: Record<number, number> = {};
      postsWithCommentCounts.forEach((post) => {
        commentCountsObject[post.id] = post.commentCount ?? 0;
      });
      setCommentCounts(commentCountsObject);
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

  // Calculate the range of posts to display based on the current page and posts per page.
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex); // Use filteredPosts for rendering.

  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage);
  };

  // Handle live search as the user types.
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    // Filter posts based on the search term.
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(newSearchTerm.toLowerCase()),
    );

    setFilteredPosts(filtered);
  };

  const handleClearSearch = (): void => {
    setSearchTerm('');
    fetchForumPosts().catch((error) => {
      console.error('Error fetching forum posts:', error);
    });
  };

  // Handle sorting.
  const handleSort = (option: 'newest' | 'mostVotes'): void => {
    setSortOption(option);

    // Sort the posts based on the selected option.
    const sorted = [...filteredPosts];

    if (option === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (option === 'mostVotes') {
      sorted.sort((a, b) => b.upvotes.length - a.upvotes.length);
    }

    setFilteredPosts(sorted);
  };

  useEffect(() => {
    fetchForumPosts().catch((error) => {
      console.error('Error fetching forum posts:', error);
    });
  }, []);

  const cardStyle = {
    padding: '20px 32px',
    marginBottom: '16px',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '800px',
    minWidth: '200px',
    margin: '0 auto',
  };

  const ellipsisStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
        <Text
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          fontStyle="italic"
          color={useColorModeValue('gray.600', 'gray.400')}
        >
          Get code help and start discussions!
        </Text>
        <Flex justifyContent="space-between" alignItems="center" w="85%" style={{ marginTop: '30px' }}>
          {/* Input for live search */}
          <InputGroup minWidth="fit-content" margin={4}>
            <InputLeftElement paddingLeft={8} pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              paddingLeft={16}
              type="text"
              placeholder="Search Post..."
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
          <Link to="/forum/new-post">
            <Button leftIcon={<AddIcon />} colorScheme="teal">
              New Post
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
          {currentPosts.map((post) => (
            <Flex key={post.id} style={cardStyle}>
              <Flex direction="column" style={{ overflow: 'hidden' }} flex="1">
                <HStack>
                  <Link
                    to={`/forum/${post.id}`}
                    style={{ fontWeight: 'bold', whiteSpace: 'nowrap', ...ellipsisStyle }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#4077CC';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'inherit';
                    }}
                  >
                    {post.title}
                  </Link>
                </HStack>
                <HStack>
                  <Box w="4" h="4">
                    <BiSolidUserCircle />
                  </Box>
                  <Text style={{ fontStyle: 'italic', whiteSpace: 'nowrap', ...ellipsisStyle }}>{post.username}</Text>
                </HStack>
                <HStack>
                  <Box w="4" h="4">
                    <BiSolidCalendar />
                  </Box>
                  <Text style={{ fontStyle: 'italic' }}>
                    {new Date(post.createdAt).toLocaleString('en-SG', { timeZone: 'Asia/Singapore', hour12: false })}
                  </Text>
                </HStack>
              </Flex>
              <HStack ml="4" mr="4">
                <TriangleUpIcon boxSize="4" />
                <Text>{post.upvotes.length}</Text>
              </HStack>
              <HStack ml="4" mr="4">
                <Box w="4" h="4">
                  <BiSolidCommentDetail />
                </Box>
                <Text>{commentCounts[post.id]}</Text>
              </HStack>
            </Flex>
          ))}
        </Stack>
        {/* Pagination component using the filteredPosts length */}
        <ForumPostsPagination
          type={'post'}
          currentPage={currentPage}
          totalItems={filteredPosts.length}
          itemsPerPage={postsPerPage}
          onPageChange={handlePageChange}
        />
      </Flex>
    </Stack>
  );
};

export default Forum;
