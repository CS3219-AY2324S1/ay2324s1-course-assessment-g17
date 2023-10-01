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
import { useAppDispatch } from '../../reducers/hooks';
import { setUser } from '../../reducers/authSlice';
import { useUser } from '../../context/UserContext';
import { type User } from '../../types/users/users';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setUser: setUserContext } = useUser() as { setUser: (user: User | null) => void };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    new AuthAPI()
      .logIn({ username, password })
      .then((user) => {
        dispatch(setUser(user));
        setUserContext(user);
        navigate('/');
      })
      .catch((err: AxiosError<{ errors: Array<{ msg: string }> }>) => {
        const errors = err?.response?.data?.errors;
        if (errors !== undefined) {
          errors.map((error) =>
            toast({
              title: 'Login failed.',
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
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" width={'100%'}>
              Log In
            </Button>
            <Flex justifyContent={'space-between'} width={'100%'}>
              <Text>
                <Link to="/">Forgot Password?</Link>
              </Text>
              <Text>
                <Link to="/signup">Sign Up</Link>
              </Text>
            </Flex>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default LoginForm;
