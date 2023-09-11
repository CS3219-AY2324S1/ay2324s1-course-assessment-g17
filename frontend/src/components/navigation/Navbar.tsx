import { Box, Button, Flex, HStack, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React from 'react';
import { FaCode } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box backgroundColor={useColorModeValue('gray.100', 'gray.900')} px={8}>
      <Flex height={16} alignItems="center" justifyContent="space-between">
        <Link to="/">
          <HStack>
            <FaCode />
            <Text fontWeight="bold">PeerPrep</Text>
          </HStack>
        </Link>
        <Button onClick={toggleColorMode}>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
      </Flex>
    </Box>
  );
};

export default Navbar;
