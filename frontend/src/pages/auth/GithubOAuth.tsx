import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Skeleton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { setUser } from '../../reducers/authSlice';
import { type User } from '../../types/users/users';
import { useAppDispatch } from '../../reducers/hooks';
import AuthAPI from '../../api/users/auth';
import IconWithText from '../../components/content/IconWithText';
import { FaGithub } from 'react-icons/fa';
import { type AxiosError } from 'axios';

export interface oAuthLoginResponse {
  user: User | null;
  githubDetails: {
    githubId: number;
    username: string;
    name?: string;
    email?: string;
  };
}

const GithubOAuth: React.FC = () => {
  const authApi = new AuthAPI();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [githubId, setGithubId] = useState(-1);
  const sentAuthentication = useRef(false);
  const code = searchParams.get('code');

  const handleAxiosErrors = (errorDescription?: string): void => {
    toast({
      title: 'Login failed.',
      description: errorDescription,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const authenticateOAuth = async (): Promise<void> => {
    if (code === null) {
      handleAxiosErrors('Missing user code');
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const { user, githubDetails } = await authApi.authenticateOAuth(code);
      if (user !== null) {
        // Exisiting user successful login
        dispatch(setUser(user));
        navigate('/');
      } else if (githubDetails?.githubId !== undefined) {
        // New user successful oAuth login
        setGithubId(githubDetails.githubId);
        setUsername(githubDetails.username);
        setName(githubDetails.name ?? '');
        setEmail(githubDetails.email ?? '');
      } else if (githubId === -1) {
        throw Error('Failed to authenticate user');
      }
    } catch (error) {
      console.log('Error authenticating user', error);
      handleAxiosErrors();
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewOAuthUser = async (): Promise<void> => {
    try {
      const user = await authApi.createNewOAuthUser(githubId, username, email);
      console.log('Created new oAuth user', user);
      dispatch(setUser(user));
      navigate('/');
    } catch (err: unknown) {
      console.log('Error creating new user', err);
      const errors = (err as AxiosError<{ errors: Array<{ msg: string }> }>)?.response?.data?.errors;
      errors?.forEach((error) => {
        handleAxiosErrors(error.msg);
      });
    }
  };

  useEffect(() => {
    if (!sentAuthentication.current) {
      sentAuthentication.current = true;
      void authenticateOAuth();
    }
  }, []);

  return (
    <Container minWidth="fit-content">
      <Card marginY={16} padding={12} minWidth="fit-content">
        <Box marginX={8} minWidth="max-content">
          <IconWithText
            text="Authenticate with Github OAuth"
            fontSize="4xl"
            fontWeight="bold"
            icon={<FaGithub size={50} />}
          />
        </Box>
        <Skeleton isLoaded={!isLoading} paddingX={12} marginY={4}>
          <Box marginBottom={8}>
            {name !== '' && <Text fontSize="2xl" marginBottom={2}>{`Hi ${name},`}</Text>}
            <Text>{`Welcome to PeerPrep! Let's get started by getting to know you more...`}</Text>
          </Box>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Username"
                size="md"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Email"
                size="md"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </FormControl>
          </Stack>
        </Skeleton>
        <Flex justifyContent="flex-end" marginTop={4}>
          <Button
            marginRight={4}
            isLoading={isLoading}
            onClick={() => {
              navigate('/login');
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            isLoading={isLoading}
            onClick={() => {
              void createNewOAuthUser();
            }}
          >
            Create PeerPrep Account
          </Button>
        </Flex>
      </Card>
    </Container>
  );
};

export default GithubOAuth;
