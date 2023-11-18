import { Flex, Button, HStack } from '@chakra-ui/react';
import { BiSolidChalkboard, BiGroup } from 'react-icons/bi';
import { MdForum } from 'react-icons/md';
import IconWithText from '../../components/content/IconWithText';
import React from 'react';
import CreatePracticeRoom from './CreatePracticeRoom';
import { Link } from 'react-router-dom';

const CreateCollaboration: React.FC = () => {
  return (
    <>
      <Flex justifyContent={'space-between'}>
        <IconWithText
          fontSize="lg"
          fontWeight="bold"
          text="Interview Preparation"
          icon={<BiSolidChalkboard size={20} />}
        />
        <HStack spacing={4}>
          <CreatePracticeRoom />
          <Link to="/matching">
            <Button leftIcon={<BiGroup size={18} />} colorScheme="teal">
              New Collaboration Match
            </Button>
          </Link>
          <Link to="/forum">
            <Button leftIcon={<MdForum size={18} />} colorScheme="teal">
              Forum
            </Button>
          </Link>
        </HStack>
      </Flex>
    </>
  );
};

export default CreateCollaboration;
