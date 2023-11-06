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
  Text,
  Spinner,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLightbulb } from 'react-icons/fa6';
import Markdown from 'react-markdown';

interface HintParams {
  questionId: number;
}

const Hint: React.FC<HintParams> = ({ questionId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hint, setHint] = useState('');
  const helpServiceUrl = process.env.REACT_APP_HELP_SERVICE_BACKEND_URL;

  const getHint = (): void => {
    axios
      .get(helpServiceUrl + questionId.toString(10))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .then((response) => response.data)
      .then((hint) => {
        setHint(hint as string);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (isOpen) {
      getHint();
    }
  }, [isOpen]);

  return (
    <Flex marginLeft={2} alignItems="center">
      <Button size="sm" variant="outline" onClick={onOpen} leftIcon={<FaLightbulb size={20} />}>
        Get Hint
      </Button>

      <Modal isCentered closeOnOverlayClick={false} size="sm" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box padding={4} id="markdown">
              <Text fontSize="2xl">Hint</Text>
              {hint !== '' ? <Markdown>{hint}</Markdown> : <Spinner size="xl" />}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Hint;
