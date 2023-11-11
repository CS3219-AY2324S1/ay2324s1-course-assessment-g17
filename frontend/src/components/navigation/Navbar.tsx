import { Box, Button, Flex, HStack, Text, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React from 'react';
import { FaCode, FaUserCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { logOut, selectIsLoggedIn } from '../../reducers/authSlice';
import AuthAPI from '../../api/users/auth';

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  const handleLogout = (): void => {
    new AuthAPI()
      .logOut()
      .then(() => {
        dispatch(logOut());
      })
      .catch(() => {
        console.error("Log out failed. This shouldn't happen.");
      });
  };

  return (
    <Box backgroundColor={useColorModeValue('gray.100', 'gray.900')} px={8}>
      <Flex height={16} alignItems="center" justifyContent="space-between">
        <Link to="/">
          <HStack>
            <FaCode />
            <Text fontWeight="bold">PeerPrep</Text>
          </HStack>
        </Link>
        <HStack>
          {isLoggedIn && (
            <Link to="/profile">
              <Tooltip label="View Profile">
                <Button>
                  <FaUserCog size={20} />
                </Button>
              </Tooltip>
            </Link>
          )}
          <Button onClick={toggleColorMode}>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
          {isLoggedIn && <Button onClick={handleLogout}>Log Out</Button>}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
