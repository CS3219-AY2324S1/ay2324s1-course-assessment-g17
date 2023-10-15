import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import IconWithText from '../../components/content/IconWithText';
import { AddIcon } from '@chakra-ui/icons';
import { MdForum } from 'react-icons/md';
import { BiArrowBack } from 'react-icons/bi';

const Forum: React.FC = () => {
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
        <Flex justifyContent="flex-end" w="85%">
          <Link to="/forum/new-post">
            <Button leftIcon={<AddIcon />} colorScheme="teal">
              New Post
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Stack>
  );
};

export default Forum;
