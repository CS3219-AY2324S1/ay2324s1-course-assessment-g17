import React, { useState } from 'react';

import {
  Button,
  Card,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCode } from 'react-icons/fa';
import AuthAPI from '../../api/users/auth';
import type { AxiosError } from 'axios';
import PasswordField from '../../components/content/PasswordField';

const SignUpForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    new AuthAPI()
      .signUp({ username, password, email, confirmPassword })
      .then(() => {
        navigate('/');
      })
      .catch((err: AxiosError<{ errors: Array<{ msg: string }> }>) => {
        const errors = err?.response?.data?.errors;
        if (errors !== undefined) {
          errors.map((error) =>
            toast({
              title: 'Sign Up failed.',
              description: error.msg,
              status: 'error',
              duration: 9000,
              isClosable: true,
            }),
          );
        }
      });
  };
  return (
    <Container>
      <Card m={12} p={8}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4} alignItems={'center'}>
            <FaCode size={50} />
            <Heading>PeerPrep</Heading>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <PasswordField
                placeholder=""
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <PasswordField
                placeholder=""
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                required
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" width={'100%'}>
              Sign Up
            </Button>
            <Flex justifyContent={'center'} width={'100%'}>
              <Text>
                <Link to="/">Have an account? Log in</Link>
              </Text>
            </Flex>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default SignUpForm;
