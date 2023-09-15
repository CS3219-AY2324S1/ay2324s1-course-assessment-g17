import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Textarea,
  Flex,
  HStack,
  useColorModeValue,
  Stack,
  Card,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from '@choc-ui/chakra-autocomplete';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa6';
import ConfirmationDialog from '../../components/content/ConfirmationDialog';
import QuestionsAPI from '../../api/questions/questions';
import IconWithText from './IconWithText';
import {
  LINK_PREFIX,
  QuestionComplexityEnum,
  type QuestionData,
  type QuestionPostData,
} from '../../types/questions/questions';
import { BiSolidBookAdd } from 'react-icons/bi';
import { type AxiosError } from 'axios';

interface QuestionFormProps {
  formTitle: string;
  dialogHeader: string;
  dialogBody: string;
  handleData: (questionData: QuestionPostData) => Promise<void> | Promise<QuestionData>;
  initialData?: QuestionData | null;
  isLoading?: boolean;
  errorTitle: string;
  submitButtonLabel: string;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  formTitle,
  dialogHeader,
  dialogBody,
  handleData,
  initialData,
  isLoading = false,
  errorTitle,
  submitButtonLabel,
}) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [complexity, setComplexity] = useState(QuestionComplexityEnum.EASY);
  const [linkToQuestion, setLinkToQuestion] = useState('');
  const [allCategories, setAllCategories] = useState<string[]>([]);

  useEffect(() => {
    new QuestionsAPI()
      .getCategories()
      .then((categories) => {
        setAllCategories(categories);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (initialData !== null && initialData !== undefined) {
      setTitle(initialData.title);
      setQuestionDescription(initialData.questionDescription);
      setCategories(initialData.categories);
      setComplexity(initialData.complexity);
      setLinkToQuestion(initialData.linkToQuestion);
    }
  }, [initialData]);

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
    handleData({ title, questionDescription, categories, complexity, linkToQuestion: LINK_PREFIX + linkToQuestion })
      .then(() => {
        navigate('/');
      })
      .catch((err: AxiosError<{ errors: Array<{ msg: string }> }>) => {
        const errors = err?.response?.data?.errors;
        if (errors !== undefined) {
          errors.map((error) =>
            toast({
              title: errorTitle,
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
        {isLoading ? (
          <Spinner size="xl" />
        ) : (
          <Stack spacing={4}>
            <IconWithText text={formTitle} icon={<BiSolidBookAdd size={25} />} fontSize={'2xl'} fontWeight="bold" />
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
                <InputLeftAddon>{LINK_PREFIX}</InputLeftAddon>
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
                dialogHeader={dialogHeader}
                dialogBody={dialogBody}
                mainButtonLabel="Cancel"
                leftButtonLabel="No, stay on this form"
                rightButtonLabel="Yes, bring me back"
                onConfirm={() => {
                  navigate('/');
                }}
              />
              <Button type="submit" colorScheme="teal" leftIcon={<FaCheck size={20} />}>
                {submitButtonLabel}
              </Button>
            </Flex>
          </Stack>
        )}
      </form>
    </Card>
  );
};

export default QuestionForm;
