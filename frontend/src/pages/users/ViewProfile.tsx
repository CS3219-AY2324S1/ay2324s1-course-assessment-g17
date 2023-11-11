import React, { useState } from 'react';
import { Box, Text, HStack, IconButton, Flex, Avatar } from '@chakra-ui/react';
import { EmailIcon, EditIcon } from '@chakra-ui/icons';
import { FaUserGroup, FaCode } from 'react-icons/fa6';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';
import EditProfile from './EditProfile';
import DeregisterButton from '../auth/DeregisterButton';
import HeatmapComponent from '../../components/user/Heatmap';
import ProgressBar from '../../components/user/ProgressBar';
import SolvedTable from '../../components/user/SolvedTable';
import CardComponent from '../../components/user/CardComponent';

const ViewProfile: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const user = useAppSelector(selectUser);
  if (user === null) {
    return <div>User not found</div>;
  }

  return (
    <>
      <Flex flexDirection={{ base: 'column', md: 'row' }} width="100%" minHeight="85vh" my={5}>
        <CardComponent>
          <Flex alignItems="center" ml={12} mt={2}>
            <Avatar bg="black" />
            <Text
              ml={3}
              fontSize="xl"
              fontWeight="bold"
              textAlign="center"
              style={{ wordWrap: 'break-word', maxWidth: '400px' }}
            >
              {user?.username}
            </Text>
          </Flex>
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
                <span style={{ fontWeight: 'bold', wordWrap: 'break-word', maxWidth: '400px' }}>Email: </span>
                {user?.email}
              </Text>
            </HStack>
            <HStack spacing={5} align="center" mt={4}>
              <FaUserGroup style={{ flex: '0 0 24px', fontSize: '24px' }} />
              <Text>
                <span style={{ fontWeight: 'bold', wordWrap: 'break-word', maxWidth: '400px' }}>Role: </span>
                {user?.role}
              </Text>
            </HStack>
            <HStack spacing={5} align="center" mt={4}>
              <FaCode style={{ flex: '0 0 24px', fontSize: '24px' }} />
              <Text>
                <span style={{ fontWeight: 'bold', wordWrap: 'break-word', maxWidth: '400px' }}>Languages: </span>
                {(user?.languages?.length ?? 0) > 0 ? user?.languages?.map((lang) => lang.language).join(', ') : 'None'}
              </Text>
            </HStack>
            <HStack spacing={5} align="center" mt={4}>
              <DeregisterButton />
            </HStack>
          </Box>
        </CardComponent>
        <Flex flexDirection="column" width="100%">
          <CardComponent>
            <HeatmapComponent user={user} />
          </CardComponent>
          <CardComponent>
            <ProgressBar user={user} />
          </CardComponent>

          <CardComponent>
            <SolvedTable user={user} />
          </CardComponent>
        </Flex>
      </Flex>
    </>
  );
};

export default ViewProfile;
