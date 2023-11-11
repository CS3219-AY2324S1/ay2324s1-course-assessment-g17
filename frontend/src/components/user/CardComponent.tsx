import React, { type ReactNode } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

interface CardComponentProps {
  children: ReactNode;
}

const CardComponent: React.FC<CardComponentProps> = ({ children }) => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.700')}
      boxShadow="lg"
      borderWidth="2px"
      borderRadius="lg"
      p={4}
      mx={6}
      mb={2}
      position="relative"
    >
      {children}
    </Box>
  );
};

export default CardComponent;
