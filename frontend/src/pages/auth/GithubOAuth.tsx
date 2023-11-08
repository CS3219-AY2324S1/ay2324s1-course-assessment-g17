import { Box, Button, Spinner, Text, useToast } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { setUser } from '../../reducers/authSlice';
import { type User } from '../../types/users/users';
import { useAppDispatch } from '../../reducers/hooks';
import AuthAPI from '../../api/users/auth';

export interface oAuthLoginResponse {
  user: User | null;
  githubDetails: {
    githubId: number;
    username: string;
    name: string | null;
    email: string | null;
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
    navigate('/login');
  };

  const authenticateOAuth = async (): Promise<void> => {
    if (code === null) {
      handleAxiosErrors('Missing user code');
      return;
    }

    try {
      setIsLoading(true);
      const { user, githubDetails } = await authApi.authenticateOAuth(code);
      if (user !== null) {
        // Exisiting user successful login
        dispatch(setUser(user));
        navigate('/');
      } else if (githubDetails.githubId !== undefined) {
        // New user successful oAuth login
        setGithubId(githubDetails.githubId);
        setUsername(githubDetails.username);
        setName(githubDetails.name ?? '');
        setEmail(githubDetails.email ?? '');
      } else if (githubId === -1) {
        throw Error('Failed to authenticate user');
      }
    } catch (error) {
      handleAxiosErrors(error as string);
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
    } catch (err) {
      handleAxiosErrors(err as string);
    }
  };

  useEffect(() => {
    if (!sentAuthentication.current) {
      sentAuthentication.current = true;
      void authenticateOAuth();
    }
  }, []);

  return (
    <Box>
      <Text>Loading...</Text>
      {name !== '' && <Text>{`Hi ${name}...`}</Text>}
      <Text>{`Username: ${username}`}</Text>
      <Text>{`Email: ${email}`}</Text>
      <Text>{`Code: ${code}`}</Text>
      {isLoading ? (
        <Spinner />
      ) : (
        <Button
          onClick={() => {
            void createNewOAuthUser();
          }}
        />
      )}
    </Box>
  );
};

export default GithubOAuth;
