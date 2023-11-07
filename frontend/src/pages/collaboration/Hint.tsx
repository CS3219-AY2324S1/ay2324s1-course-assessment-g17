import {
  Button,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  ButtonGroup,
  PopoverFooter,
  Text,
  useDisclosure,
  Skeleton,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLightbulb } from 'react-icons/fa6';
import Markdown from 'react-markdown';

interface HintParams {
  questionId: number;
}

const Hint: React.FC<HintParams> = ({ questionId }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hint, setHint] = useState<string | null>(null);
  const helpServiceUrl = process.env.REACT_APP_HELP_SERVICE_BACKEND_URL;

  const getHint = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await axios
        .get(`${helpServiceUrl}${questionId.toString(10)}`)
        .then((response) => response.data as string)
        .then((hint) => {
          setHint(hint);
        });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHint(null);
    setIsLoading(false);
  }, [questionId]);

  return (
    <Popover isLazy placement="bottom" offset={[-100, 0]} isOpen={isOpen}>
      <PopoverTrigger>
        <Flex marginLeft={2} alignItems="center">
          <Button size="sm" variant="outline" leftIcon={<FaLightbulb size={20} />} onClick={onToggle}>
            Get Hint
          </Button>
        </Flex>
      </PopoverTrigger>
      <PopoverContent minW={{ base: '100%', lg: 'min-content' }}>
        <PopoverArrow />
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          Generate a hint with AI
        </PopoverHeader>
        <PopoverCloseButton onClick={onClose} />
        <PopoverBody id="markdown" paddingBottom={hint === null ? 4 : 8}>
          {hint === null ? (
            <Skeleton isLoaded={!isLoading}>
              <Text>
                Stuck on the problem? Generate a hint with the help of AI! These hints might not be entirely accurate,
                take them with a pinch of salt!
              </Text>
            </Skeleton>
          ) : (
            <Markdown>{hint}</Markdown>
          )}
        </PopoverBody>
        {hint === null && (
          <PopoverFooter border="0" display="flex" alignItems="center" justifyContent="end" paddingBottom={4}>
            <ButtonGroup size="sm">
              <Button colorScheme="gray" onClick={onClose} isLoading={isLoading}>
                Cancel
              </Button>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <Button colorScheme="blue" onClick={getHint} isLoading={isLoading}>
                Got it, give me a hint
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Hint;
