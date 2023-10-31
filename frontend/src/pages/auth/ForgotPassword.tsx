import React, { useState } from 'react';
import axios from 'axios';
import { FormControl, FormLabel, Input, Button, Box, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const userServiceUrl = process.env.REACT_APP_USER_SERVICE_BACKEND_URL;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    axios
      .post(`${userServiceUrl}send-reset-email`, {
        email,
      })
      .then(() => {
        toast({
          title: 'Sent reset email!',
          description: 'Check your email for a link to reset your password.',
          duration: 2000,
          status: 'success',
          isClosable: true,
        });
        navigate('/');
        console.log('Reset email sent successfully!');
      })
      .catch((error) => {
        toast({
          title: 'Invalid email!',
          description: 'Please enter a valid email.',
          duration: 2000,
          status: 'error',
          isClosable: true,
        });
        console.error('Error sending reset email:', error);
      });
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </FormControl>
        <Button type="submit" mt={4} colorScheme="teal">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default ForgotPassword;
