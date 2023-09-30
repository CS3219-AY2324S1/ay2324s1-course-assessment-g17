import React, { useEffect, useState } from 'react';
import { Button, Card, Center, FormControl, FormLabel, HStack, Select, Stack } from '@chakra-ui/react';
import { io, type Socket } from 'socket.io-client';
import QuestionCategoryAutocomplete from '../../components/questions/QuestionCategoryAutocomplete';
import { QuestionComplexityEnum } from '../../types/questions/questions';
import { FaBoltLightning } from 'react-icons/fa6';
import IconWithText from '../../components/content/IconWithText';

const Matching: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [complexity, setComplexity] = useState(QuestionComplexityEnum.EASY);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:9000');

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleMatchRequest: React.FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();
    socket?.emit('requestMatch', { complexity, categories });
  };

  return (
    <Center width={'100%'}>
      <Card m={12} p={8} minWidth={'50%'}>
        <IconWithText text={'Request Match'} icon={<FaBoltLightning size={25} />} fontSize={'2xl'} fontWeight="bold" />
        <form onSubmit={handleMatchRequest}>
          <Stack spacing={4}>
            <HStack mt={2}>
              <FormControl isRequired>
                <FormLabel>Complexity</FormLabel>
                <Select
                  value={complexity}
                  onChange={(e) => {
                    setComplexity(e.target.value as QuestionComplexityEnum);
                  }}
                >
                  <option value={QuestionComplexityEnum.EASY}>Easy</option>
                  <option value={QuestionComplexityEnum.MEDIUM}>Medium</option>
                  <option value={QuestionComplexityEnum.HARD}>Hard</option>
                </Select>
              </FormControl>
            </HStack>

            <FormControl isRequired>
              <FormLabel>Categories</FormLabel>
              <QuestionCategoryAutocomplete categories={categories} handleChange={setCategories} />
            </FormControl>
            <Button type="submit" colorScheme="teal" leftIcon={<FaBoltLightning size={20} />}>
              Find a match!
            </Button>
          </Stack>
        </form>
      </Card>{' '}
    </Center>
  );
};

export default Matching;
