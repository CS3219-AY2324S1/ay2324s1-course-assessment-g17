import React, {useState} from 'react';
import { Box, Text, useColorModeValue, HStack, IconButton } from '@chakra-ui/react';
import { EmailIcon, EditIcon } from '@chakra-ui/icons';
import { FaUserGroup, FaCode } from 'react-icons/fa6';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import EditProfile from './EditProfile';

const ViewProfile: React.FC = () => {

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const user = useAppSelector(selectUser);

  const handleProfileUpdated = (): void => {
    // Refresh user profile page
    window.location.reload();
  };

  return (
    <Box width="100%" height="85vh" my={5}>
      <Box
        bg={useColorModeValue('gray.50', 'gray.700')}
        boxShadow="lg"
        borderWidth="2px"
        borderRadius="lg"
        p={4}
        width={['90%', '80%', '70%', '50%']}
        mx="auto"
        position="relative"
      >
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {user?.username}
        </Text>
        <IconButton
          isRound={true}
          variant="solid"
          colorScheme="gray"
          aria-label="Edit Profile"
          icon={<EditIcon />}
          position="absolute"
          top="4"
          right="4"
          zIndex="1"
          onClick={() => {
            setIsEditModalOpen(true);
          }}
        />
        <EditProfile
          isOpen={isEditModalOpen}
          onCloseModal={() => {
            setIsEditModalOpen(false);
          }}
          initialUsername={user?.username || ''}
          initialEmail={user?.email || ''}
          initialLanguages={user?.languages || []}
          onProfileUpdated={handleProfileUpdated}
        />
        <Box textAlign="left" pl={12} pr={12} pt={2} pb={8}>
          <HStack spacing={5} align="center" mt={4}>
            <EmailIcon boxSize={6} />
            <Text>
              <span style={{ fontWeight: 'bold' }}>Email: </span>
              {user?.email}
            </Text>
          </HStack>
          <HStack spacing={5} align="center" mt={4}>
            <FaUserGroup fontSize="24px" />
            <Text>
              <span style={{ fontWeight: 'bold' }}>Role: </span>
              {user?.role}
            </Text>
          </HStack>
          <HStack spacing={5} align="center" mt={4}>
            <FaCode fontSize="24px" />
            <Text>
              <span style={{ fontWeight: 'bold' }}>Languages: </span>
              {(user?.languages?.length ?? 0) > 0 ? user?.languages?.map((lang) => lang.language).join(', ') : 'None'}
            </Text>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewProfile;
