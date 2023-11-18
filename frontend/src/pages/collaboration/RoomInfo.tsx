import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import {
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
  Text,
  useClipboard,
} from '@chakra-ui/react';
import { BiLockAlt, BiInfoCircle, BiCopy, BiCheck } from 'react-icons/bi';

interface RoomInfoProps {
  isMatchingRoom: boolean;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ isMatchingRoom }: RoomInfoProps) => {
  const { roomId } = useParams();
  const { onCopy, hasCopied, setValue } = useClipboard('');

  useEffect(() => {
    if (roomId !== undefined) {
      setValue(roomId);
    }
  }, [roomId]);

  return (
    <Flex mb={2} minWidth="500px" alignItems="center">
      <Popover trigger="hover">
        <PopoverTrigger>
          <HStack mx={4}>
            <Text whiteSpace="nowrap" size="sm" fontWeight="bold">
              Room ID
            </Text>
            {isMatchingRoom && <BiLockAlt size={16} />}
            {!isMatchingRoom && <BiInfoCircle size={16} />}
          </HStack>
        </PopoverTrigger>
        <PopoverContent minW={{ base: '100%', lg: '500px' }}>
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
                  {isMatchingRoom
                    ? 'This room is password protected. Users have to enter the password to join the room.'
                    : 'This room is not password protected. Anyone with the room ID can join.'}
                </Text>
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
