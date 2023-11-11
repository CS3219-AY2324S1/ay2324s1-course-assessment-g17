import { Stack } from '@chakra-ui/react';
import Questions from '../questions/Questions';
import React from 'react';
import CreateCollaboration from '../collaboration/CreateCollaboration';

const Home: React.FC = () => {
  return (
    <Stack paddingX={16} paddingY={8}>
      <CreateCollaboration />
      <Questions />
    </Stack>
  );
};

export default Home;
