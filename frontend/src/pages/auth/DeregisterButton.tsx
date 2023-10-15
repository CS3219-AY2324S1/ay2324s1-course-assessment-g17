import React from 'react';
import { IconButton, Icon, useToast, Flex, Box } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import AuthAPI from '../../api/users/auth';
import { logOut } from '../../reducers/authSlice';
import { useAppDispatch } from '../../reducers/hooks';

const DeregisterButton: React.FC = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const handleClick = (): void => {
    new AuthAPI()
      .deregister()
      .then(() => {
        dispatch(logOut());
      })
      .catch((err) => {
        console.log('Error deleting question:', err);
        toast({
          title: 'Account deletion failed.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <Box onClick={handleClick} cursor="pointer">
      <Flex align="center" ml={-2}>
        <IconButton isRound aria-label="Delete Account" icon={<Icon as={WarningTwoIcon} />} bgColor="transparent" />
        <Flex direction="column" ml={2}>
          <span>Delete Account</span>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DeregisterButton;
