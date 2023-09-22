import React, { useEffect, useState } from 'react';
import { Box, Text, useColorModeValue, HStack, Button } from '@chakra-ui/react';
import { EmailIcon, EditIcon } from '@chakra-ui/icons';
import { FaUserGroup, FaCode } from 'react-icons/fa6';
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
    <Box width="100%" height="85vh" my={5}>
      <Box
        bg={useColorModeValue('gray.50', 'gray.700')}
        boxShadow="lg"
        borderWidth="2px"
        borderRadius="lg"
        p={4}
        width={['90%', '80%', '70%', '50%']} /* sm, md, lg, xl screens */
        mx="auto"
        position="relative"
      >
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {userData.username}
        </Text>
        <Button
          leftIcon={<EditIcon />}
          colorScheme="teal"
          position="absolute"
          top="4"
          right="4"
          zIndex="1"
        >
          Edit Profile
        </Button>
        <Box textAlign="left" pl={12} pr={12} pt={2} pb={8}>
          <HStack spacing={5} align="center" mt={4}>
            <EmailIcon boxSize={6} />
            <Text>
              <span style={{ fontWeight: 'bold' }}>Email: </span>
              {userData.email}
            </Text>
          </HStack>
          <HStack spacing={5} align="center" mt={4}>
            <FaUserGroup fontSize="24px" />
            <Text>
              <span style={{ fontWeight: 'bold' }}>Role: </span>
              {userData.role}
            </Text>
          </HStack>
          <HStack spacing={5} align="center" mt={4}>
            <FaCode fontSize="24px" />
            <Text>
              <span style={{ fontWeight: 'bold' }}>Languages: </span>
              {userData.languages.length > 0 ? userData.languages.map((lang) => lang.language).join(', ') : 'None'}
            </Text>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewProfile;
