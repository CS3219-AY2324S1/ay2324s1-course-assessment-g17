import { Box, Button, Flex, HStack, Input, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IconWithText from '../../components/content/IconWithText';
import { AddIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { MdForum } from 'react-icons/md';
import { BiArrowBack, BiSolidCalendar, BiSolidUserCircle } from 'react-icons/bi';
import { type ForumData } from '../../types/forum/forum';
import ForumAPI from '../../api/forum/forum';

const Forum: React.FC = () => {
  const toast = useToast();

  const [posts, setPosts] = useState<ForumData[]>([]);

  const fetchForumPosts = async (): Promise<void> => {
    try {
      const forumAPI = new ForumAPI();
      const forumPosts = await forumAPI.viewPosts();
      console.log(forumPosts);
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

  const cardStyle = {
    border: '1px solid #ccc',
    padding: '20px 32px',
    marginBottom: '16px',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    width: '80%',
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
            </Flex>
          ))}
        </Stack>
      </Flex>
    </Stack>
  );
};

export default Forum;
