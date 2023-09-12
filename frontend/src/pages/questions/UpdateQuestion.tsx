import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Textarea,
  useToast,
  Card,
  Flex,
  HStack,
  useColorModeValue,
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
import { useNavigate, useParams } from 'react-router-dom';
import { type AxiosError } from 'axios';
import { FaCheck } from 'react-icons/fa6';
import { BiSolidBookAdd } from 'react-icons/bi';
import IconWithText from '../../components/content/IconWithText';
import ConfirmationDialog from '../../components/content/ConfirmationDialog';

export const UpdateQuestion: React.FC = () => {
  const { questionId } = useParams();
  let questionIdString: string;
  if (questionId !== undefined) {
    questionIdString = questionId;
  } else {
    throw new Error('ID of question is undefined');
  }
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

  useEffect(() => {
    new QuestionsAPI()
      .getQuestion(questionIdString)
      .then((questionData) => {
        setTitle(questionData.title);
        setQuestionDescription(questionData.questionDescription);
        setCategories(questionData.categories);
        setComplexity(questionData.complexity);
        setLinkToQuestion(questionData.linkToQuestion.replace(linkPrefix, ''));
      })
      .catch((error) => {
        console.error('Error fetching question data:', error);
      });
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    new QuestionsAPI()
      .updateQuestion(questionIdString, {
        title,
        questionDescription,
        categories,
        complexity,
        linkToQuestion: linkPrefix + linkToQuestion,
      })
      .then(() => {
        navigate('/');
      })
      .catch((err: AxiosError<{ errors: Array<{ msg: string }> }>) => {
        const errors = err?.response?.data?.errors;
        if (errors !== undefined) {
          errors.map((error) =>
            toast({
              title: 'Question update failed.',
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
          <IconWithText text="Update Question" icon={<BiSolidBookAdd size={25} />} fontSize={'2xl'} fontWeight="bold" />
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
              value={categories}
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
