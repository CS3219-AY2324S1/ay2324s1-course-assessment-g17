import {
  Button,
  Card,
  Flex,
  FormControl,
  FormLabel,
  HStack,
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
import { FaCheck } from 'react-icons/fa6';
import { BiSolidBookAdd } from 'react-icons/bi';
import React, { useEffect, useState } from 'react';
import QuestionsAPI from '../../api/questions/questions';
import { useNavigate } from 'react-router-dom';
import { type AxiosError } from 'axios';
import IconWithText from '../../components/content/IconWithText';
import ConfirmationDialog from '../../components/content/ConfirmationDialog';

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
    if (categories.length === 0) {
      toast({
        title: 'Missing Categories!',
        description: 'Please fill in the question categories before submitting.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }
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
          <IconWithText text="Create Question" icon={<BiSolidBookAdd size={25} />} fontSize={'2xl'} fontWeight="bold" />
          <HStack mt={2}>
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
              <AutoCompleteInput variant="filled" isRequired={false}>
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
              placeholder="Description of Leetcode question"
              _placeholder={{ color: useColorModeValue('gray.600', 'gray.400') }}
              value={questionDescription}
              onChange={(e) => {
                setQuestionDescription(e.target.value);
              }}
              required
              rows={8}
            />
          </FormControl>

          <Flex mt={4} justifyContent="space-between">
            <ConfirmationDialog
              dialogHeader="Cancel Question Creation"
              dialogBody="Are you sure? Any progress on the form will not be saved. This action is irreversible!"
              mainButtonLabel="Cancel"
              leftButtonLabel="No, stay on this form"
              rightButtonLabel="Yes, bring me back"
              onConfirm={() => {
                navigate('/');
              }}
            />
            <Button type="submit" colorScheme="teal" leftIcon={<FaCheck size={20} />}>
              Submit Question
            </Button>
          </Flex>
        </Stack>
      </form>
    </Card>
  );
};
