import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Flex,
  Box,
} from '@chakra-ui/react';
import { PiChalkboardFill } from 'react-icons/pi';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import React from 'react';

const Whiteboard: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex marginLeft={2} alignItems="center">
      <Button size="sm" variant="outline" onClick={onOpen} leftIcon={<PiChalkboardFill size={20} />}>
        Whiteboard
      </Button>

      <Modal isCentered closeOnOverlayClick={false} size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height="90vh">
          <ModalCloseButton />
          <ModalBody height="83vh" marginTop={8}>
            <Box width="100%" height="83vh" padding={4}>
              <Tldraw />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Whiteboard;
