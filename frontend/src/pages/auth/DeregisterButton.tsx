import React from 'react';
import ConfirmationDialog from '../../components/content/ConfirmationDialog';
import AuthAPI from '../../api/users/auth';
import { useToast } from '@chakra-ui/react';
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
    <ConfirmationDialog
      dialogHeader={'Delete Account'}
      dialogBody={'Are you sure you want to delete your account? This action is irreversible!'}
      mainButtonLabel={'Delete Account'}
      rightButtonLabel={'Yes, delete my account permanently!'}
      onConfirm={handleClick}
      mainButtonProps={{ colorScheme: 'gray' }}
    />
  );
};

export default DeregisterButton;
