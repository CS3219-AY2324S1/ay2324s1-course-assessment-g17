import { Box, Button, Spinner, Text, useToast } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import axios, { type AxiosResponse, type AxiosError } from 'axios';
import { setUser } from '../../reducers/authSlice';
import { type User } from '../../types/users/users';
import { useAppDispatch } from '../../reducers/hooks';

interface oAuthLoginResponse {
  user: User | null;
  githubDetails: {
    githubId: number;
    username: string;
    name: string | null;
    email: string | null;
  };
}

const GithubOAuth: React.FC = () => {
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

  const handleAxiosErrors = (err: AxiosError<{ errors: Array<{ msg: string }> }>): void => {
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
  };

  const authenticateOAuth = async (): Promise<void> => {
    setIsLoading(true);
    await axios
      .post(`${process.env.REACT_APP_USER_SERVICE_BACKEND_URL}oauth/auth`, { code }, { withCredentials: true })
      .then((resp: AxiosResponse<oAuthLoginResponse, unknown>) => {
        const user = resp.data.user;
        const githubDetails = resp.data.githubDetails;
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
          toast({ title: 'Something went wrong!', status: 'error' });
        }
      })
      .catch((err: AxiosError<{ errors: Array<{ msg: string }> }>) => {
        handleAxiosErrors(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const createNewOAuthUser = async (): Promise<void> => {
    await axios
      .post(`${process.env.REACT_APP_USER_SERVICE_BACKEND_URL}oauth/signup`, { githubId, username, email })
      .then((resp: AxiosResponse<User, unknown>) => {
        console.log('resp.data', resp.data);
        dispatch(setUser(resp.data));
        navigate('/');
      })
      .catch((err: AxiosError<{ errors: Array<{ msg: string }> }>) => {
        handleAxiosErrors(err);
      });
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
