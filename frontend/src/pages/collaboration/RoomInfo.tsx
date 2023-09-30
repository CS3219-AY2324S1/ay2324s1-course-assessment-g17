import { useLocation, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Button,
  Code,
  Divider,
  Flex,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { BiLockAlt, BiInfoCircle, BiCopy, BiCheck } from 'react-icons/bi';
import PasswordField from '../../components/content/PasswordField';

const RoomInfo: React.FC = () => {
  const location = useLocation();
  const isPasswordProtected = location.state !== null;
  const { roomId } = useParams();
  const { onCopy, hasCopied, setValue } = useClipboard('');

  console.log('location.state', location.state);

  useEffect(() => {
    if (roomId !== undefined) {
      setValue(roomId);
    }
  }, [roomId]);

  return (
    <Flex mb={2} minWidth="485px" alignItems="center">
      <Popover trigger="hover">
        <PopoverTrigger>
          <HStack mr={4}>
            {isPasswordProtected && <BiLockAlt size={16} />}
            {!isPasswordProtected && <BiInfoCircle size={16} />}
            <Text whiteSpace="nowrap" size="sm" fontWeight="bold">
              Room ID
            </Text>
          </HStack>
        </PopoverTrigger>
        <PopoverContent minW={{ base: '100%', lg: '700px' }}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight="bold">Room Information</PopoverHeader>
          <PopoverBody>
            <Box paddingX={4}>
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Invite
                </Text>
                <Text as="span">To invite friends to join this room, simply share with them the room ID </Text>
                <Code>{roomId}</Code>
                <IconButton
                  size="xl"
                  variant="ghost"
                  icon={hasCopied ? <BiCheck onClick={onCopy} /> : <BiCopy onClick={onCopy} />}
                  aria-label="Copy room ID"
                  ml={2}
                />
              </Box>
              <Divider my={4} />
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Security Settings
                </Text>

                <Text>
                  {isPasswordProtected
                    ? 'This room is password protected. Users have to enter the password to join the room.'
                    : 'This room is not password protected. Anyone with the room ID can join.'}
                </Text>

                <Accordion allowToggle marginY={4}>
                  <AccordionItem>
                    <AccordionButton>
                      <Box as="span" flex={1} textAlign="left">
                        {isPasswordProtected ? 'Manage password configurations' : 'Set a password to protect the room'}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <Stack spacing={4}>
                        <Text>
                          Protect your practice room with a password. Users who want to join the room will be prompted
                          for the password before they can join.
                        </Text>
                        <Alert status="warning">
                          <AlertIcon />
                          Updating the room password might result in lost of progress. Other users might also get
                          disconnected from the room. Proceed with caution.
                        </Alert>
                        <HStack>
                          <PasswordField placeholder="Room password (optional)" />
                          <Button>Update</Button>
                        </HStack>
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Input isReadOnly mr={4} variant="filled" size="sm" value={roomId} />
      <Button size="sm" onClick={onCopy}>
        {hasCopied ? 'Copied!' : 'Copy'}
      </Button>
    </Flex>
  );
};

export default RoomInfo;
