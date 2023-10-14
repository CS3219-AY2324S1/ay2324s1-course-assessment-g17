import React, { useState } from 'react';
import { Box, Text, useColorModeValue, HStack, IconButton, Flex } from '@chakra-ui/react';
import { EmailIcon, EditIcon } from '@chakra-ui/icons';
import { FaUserGroup, FaCode } from 'react-icons/fa6';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import EditProfile from './EditProfile';
import DeregisterButton from '../auth/DeregisterButton';
import HeatmapComponent from '../../components/user/Heatmap';

const ViewProfile: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const user = useAppSelector(selectUser);
  if (user === null) {
    return <div>User not found</div>;
  }

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
          initialUsername={user?.username !== undefined ? user?.username : ''}
          initialEmail={user?.email !== undefined ? user?.email : ''}
          initialLanguages={user?.languages !== undefined ? user?.languages : []}
        />
        <Box textAlign="left" pl={12} pr={12} pt={2} pb={8}>
          <HStack spacing={5} align="center" mt={4}>
            <EmailIcon style={{ flex: '0 0 24px', fontSize: '24px' }} />
            <Text>
              <span style={{ fontWeight: 'bold' }}>Email: </span>
              {user?.email}
            </Text>
          </HStack>
          <HStack spacing={5} align="center" mt={4}>
            <FaUserGroup style={{ flex: '0 0 24px', fontSize: '24px' }} />
            <Text>
              <span style={{ fontWeight: 'bold' }}>Role: </span>
              {user?.role}
            </Text>
          </HStack>
          <HStack spacing={5} align="center" mt={4}>
            <FaCode style={{ flex: '0 0 24px', fontSize: '24px' }} />
            <Text>
              <span style={{ fontWeight: 'bold' }}>Languages: </span>
              {(user?.languages?.length ?? 0) > 0 ? user?.languages?.map((lang) => lang.language).join(', ') : 'None'}
            </Text>
          </HStack>
        </Box>
        <HeatmapComponent user={user} />
        <Flex justifyContent="center" mt={4} mb={6}>
          <DeregisterButton />
        </Flex>
      </Box>
    </Box>
  );
};

export default ViewProfile;
