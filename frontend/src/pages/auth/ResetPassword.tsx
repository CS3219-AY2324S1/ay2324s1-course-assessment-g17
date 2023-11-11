import React, { useState } from 'react';
import axios from 'axios';
import { FormControl, FormLabel, Input, Button, Box, useToast } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const userServiceUrl = process.env.REACT_APP_USER_SERVICE_BACKEND_URL;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    axios
      .post(`${userServiceUrl}reset-password?token=${token}`, {
        password,
      })
      .then(() => {
        toast({
          title: 'Password reset successful!',
          description: 'You can now login with your new password.',
          duration: 2000,
          status: 'success',
          isClosable: true,
        });
        navigate('/');
      })
      .catch((error) => {
        toast({
          title: 'Error resetting password!',
          description: 'Please try again later.',
          duration: 2000,
          status: 'error',
          isClosable: true,
        });
        console.error('Error resetting password:', error);
      });
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <FormControl id="password" isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </FormControl>
        <Button type="submit" mt={4} colorScheme="teal">
          Reset Password
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;
