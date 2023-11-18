import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Flex,
  HStack,
  useColorModeValue,
  Stack,
  Card,
  useToast,
  Spinner,
} from '@chakra-ui/react';

import RichTextEditor from './RichTextEditor';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa6';
import ConfirmationDialog from '../../components/content/ConfirmationDialog';
import IconWithText from './IconWithText';
import {
  LINK_PREFIX,
  QuestionComplexityEnum,
  type QuestionData,
  type QuestionPostData,
} from '../../types/questions/questions';
import { BiSolidBookAdd } from 'react-icons/bi';
import { type AxiosError } from 'axios';
import QuestionCategoryAutocomplete from '../../components/questions/QuestionCategoryAutocomplete';

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

  const disableSubmit =
    initialData !== undefined && initialData !== null
      ? title === initialData.title &&
        questionDescription === initialData.questionDescription &&
        initialData.complexity === complexity &&
        initialData.linkToQuestion === linkToQuestion &&
        JSON.stringify(initialData.categories) === JSON.stringify(categories)
      : false;

  const handleDescriptionChange = (newContent: React.SetStateAction<string>): void => {
    setQuestionDescription(newContent);
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
              <QuestionCategoryAutocomplete categories={categories} handleChange={setCategories} />
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
              <RichTextEditor
                value={questionDescription}
                onChange={handleDescriptionChange}
                useColorModeValue={useColorModeValue}
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
              <Button type="submit" colorScheme="teal" leftIcon={<FaCheck size={20} />} isDisabled={disableSubmit}>
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
