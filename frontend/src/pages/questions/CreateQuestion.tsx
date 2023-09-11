import {
  Button,
  Card,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from '@choc-ui/chakra-autocomplete';

import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { useNavigate } from 'react-router-dom';
import { type AxiosError } from 'axios';

export const CreateQuestion: React.FC = () => {
  const [title, setTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [complexity, setComplexity] = useState('Easy');
  const [linkToQuestion, setLinkToQuestion] = useState('');
  const [allCategories, setAllCategories] = useState<string[]>([]);

  const toast = useToast();

  const linkPrefix = 'https://leetcode.com/problems/';

  const navigate = useNavigate();

  useEffect(() => {
    new QuestionsAPI()
      .getCategories()
      .then((categories) => {
        setAllCategories(categories);
      })
      .catch(console.error);
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    new QuestionsAPI()
      .addQuestion({ title, questionDescription, categories, complexity, linkToQuestion: linkPrefix + linkToQuestion })
      .then(() => {
        navigate('/');
      })
      .catch((err: AxiosError<{ errors: Array<{ msg: string }> }>) => {
        const errors = err?.response?.data?.errors;
        if (errors !== undefined) {
          errors.map((error) =>
            toast({
              title: 'Question creation failed.',
              description: error.msg,
              status: 'error',
              duration: 9000,
              isClosable: true,
            }),
          );
        }
      });
  };

  return (
    <Card m={12} p={8}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Heading size={'lg'} mb={4}>
            Create Question
          </Heading>
          <HStack>
            <FormControl isRequired width={'250%'}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                required
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Complexity</FormLabel>
              <Select
                value={complexity}
                onChange={(e) => {
                  setComplexity(e.target.value);
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Select>
            </FormControl>
          </HStack>

          <FormControl isRequired>
            <FormLabel>Categories</FormLabel>
            <AutoComplete
              openOnFocus
              closeOnSelect
              multiple
              onChange={(categories) => {
                setCategories(categories as string[]);
              }}
              isLoading={allCategories.length === 0}
              suggestWhenEmpty
              restoreOnBlurIfEmpty={false}
            >
              <AutoCompleteInput variant="filled">
                {({ tags }) =>
                  tags.map((tag, tid) => (
                    <AutoCompleteTag key={tid} label={tag.label as string} onRemove={tag.onRemove} />
                  ))
                }
              </AutoCompleteInput>
              <AutoCompleteList>
                {allCategories.map((category, cid) => (
                  <AutoCompleteItem
                    key={`option-${cid}`}
                    value={category}
                    style={{ marginTop: 4, marginBottom: 4 }}
                    _selected={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.50'), color: 'gray.500' }}
                    _focus={{ bg: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
                  >
                    {category}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Link to Question</FormLabel>
            <InputGroup>
              <InputLeftAddon>{linkPrefix}</InputLeftAddon>
              <Input
                value={linkToQuestion}
                onChange={(e) => {
                  setLinkToQuestion(e.target.value);
                }}
              />
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Description of leetcode question"
              value={questionDescription}
              onChange={(e) => {
                setQuestionDescription(e.target.value);
              }}
              required
              rows={8}
            />
          </FormControl>

          <Button type="submit" colorScheme="teal">
            Submit
          </Button>
        </Stack>
      </form>
    </Card>
  );
};
