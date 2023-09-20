import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import AuthAPI from '../../api/users/auth';
import type { Language } from '../../types/users/users';

const ViewProfile: React.FC = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: '',
    languages: [] as Language[],
  });

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      try {
        const response = await new AuthAPI().getCurrentUser();
        setUserData(response);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile().catch((error) => {
      console.error('Error fetching user profile:', error);
    });
  }, []);

  return (
    <Box width="100%" height="85vh" my={5} textAlign="center">
      <Text fontSize="xl" fontWeight="bold">
        {userData.username}
      </Text>
      <Box mt={4}>
        <Text>Email: {userData.email}</Text>
        <Text>Role: {userData.role}</Text>
        <Text>
          Languages:
          {userData.languages.length > 0 ? userData.languages.map((lang) => lang.language).join(', ') : ' None'}
        </Text>
      </Box>
    </Box>
  );
};

export default ViewProfile;
