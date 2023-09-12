import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Textarea,
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
import { useNavigate, useParams } from 'react-router-dom';
import { type AxiosError } from 'axios';

export const UpdateQuestion: React.FC = () => {
  const { questionId } = useParams();

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
    // Fetch the existing question data based on questionId and set the state variables for editing
    const fetchQuestionData = async () => {
      try {
        const questionData = await new QuestionsAPI().getQuestion(questionId);
        // const questionData = response.data.data;
      
        setTitle(questionData.title);
        setQuestionDescription(questionData.questionDescription);
        setCategories(questionData.categories);
        setComplexity(questionData.complexity);
        setLinkToQuestion(questionData.linkToQuestion.replace(linkPrefix, ''));
      } catch (error) {
        console.error('Error fetching question data:', error);
      }
    };
      fetchQuestionData();
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    new QuestionsAPI()
      .updateQuestion(questionId, { title, questionDescription, categories, complexity, linkToQuestion: linkPrefix + linkToQuestion })
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
    <Container>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Heading size={'2xl'} mb={4} mt={8}>
            Update Question
          </Heading>
          <FormControl isRequired>
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
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Description of leetcode question"
              value={questionDescription}
              onChange={(e) => {
                setQuestionDescription(e.target.value);
              }}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Categories</FormLabel>
            <AutoComplete
              openOnFocus
              closeOnSelect
              closeOnBlur
              multiple
              onChange={(categories) => {
                setCategories(categories as string[]);
              }}
              isLoading={allCategories.length === 0}
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
                    _selected={{ bg: 'whiteAlpha.50' }}
                    _focus={{ bg: 'whiteAlpha.100' }}
                  >
                    {category}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
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
          <Button type="submit" colorScheme="teal">
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
};
