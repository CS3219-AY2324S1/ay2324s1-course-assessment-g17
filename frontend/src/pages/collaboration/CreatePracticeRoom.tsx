import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Box,
  Divider,
  HStack,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { BiDoorOpen } from 'react-icons/bi';
import PasswordField from '../../components/content/PasswordField';
import { v4 as uuidv4, validate, version } from 'uuid';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePracticeRoom: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isPracticeRoomOpen, setIsPracticeRoomOpen] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const handleRoomCreation = (): void => {
    const roomId = uuidv4();
    navigate(`/collaborate/${roomId}`, { state: roomPassword });
  };
  const handleRoomJoin = (): void => {
    if (!validate(roomIdInput) || version(roomIdInput) !== 4) {
      toast({
        title: 'Invalid room ID',
        description: 'The room ID provided is invalid. Please check again.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    navigate(`/collaborate/${roomIdInput}`);
  };

  return (
    <>
      <Button
        leftIcon={<BiDoorOpen size={18} />}
        onClick={() => {
          setIsPracticeRoomOpen(true);
        }}
        colorScheme="teal"
      >
        Practice Room
      </Button>
      <Modal
        isOpen={isPracticeRoomOpen}
        onClose={() => {
          setIsPracticeRoomOpen(false);
        }}
      >
        <ModalOverlay>
          <ModalContent minW={{ md: '700px' }} padding={2}>
            <ModalHeader fontSize="lg" fontWeight="bold">
              Create or join a practice room
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack marginBottom={4}>
                <Text fontWeight="bold">Create a room</Text>
                <Text>Create a new practice room and invite your friends to join to start coding together!</Text>
                <Accordion allowToggle marginY={2}>
                  <AccordionItem>
                    <AccordionButton>
                      <Box as="span" flex={1} textAlign="left">
                        Optionally, set a password to protect the room
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <Text marginBottom={4}>
                        Protect your practice room with a password. Users who want to join the room will be prompted for
                        the password before they can join.
                      </Text>
                      <PasswordField
                        placeholder="Room password (optional)"
                        onChange={(e) => {
                          setRoomPassword(e.target.value);
                        }}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                <Button onClick={handleRoomCreation}>Create room</Button>
              </Stack>
              <Divider />
              <Stack marginY={4}>
                <Text fontWeight="bold">Join a room</Text>
                <Text>Already have an invite? Join an existing room!</Text>
                <HStack>
                  <Input
                    placeholder="Room ID"
                    onChange={(e) => {
                      setRoomIdInput(e.target.value);
                    }}
                  />
                  <Button onClick={handleRoomJoin}>Join room</Button>
                </HStack>
              </Stack>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default CreatePracticeRoom;
