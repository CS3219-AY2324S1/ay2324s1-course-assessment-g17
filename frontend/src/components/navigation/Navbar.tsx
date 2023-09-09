import { Box, Button, Flex, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React from 'react';

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box backgroundColor={useColorModeValue('gray.100', 'gray.900')} px={8}>
        <Flex height={16} alignItems="center" justifyContent="space-between">
          <Text fontWeight="bold">
            PeerPrep
          </Text>
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
    </Box>
  );
};

export default Navbar;
