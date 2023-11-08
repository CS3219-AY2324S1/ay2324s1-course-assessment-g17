// LOOKS TO BE DONE

import React, { useState, useEffect } from 'react';
import {
  Spinner,
  Button,
  FormControl,
  FormLabel,
  Stack,
  Card,
  useToast,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import RichTextEditor from '../content/RichTextEditor';
import { FaCheck } from 'react-icons/fa6';
import ConfirmationDialog from '../content/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import IconWithText from '../content/IconWithText';
import { MdForum } from 'react-icons/md';
import type { CommentData } from '../../types/forum/forum';
import { type AxiosError } from 'axios';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';

interface CommentFormProps {
  formTitle: string;
  postId: string;
  dialogHeader: string;
  dialogBody: string;
  isLoading: boolean;
  handleData: (commentData: CommentData) => Promise<void>;
  initialData?: CommentData | null;
  errorTitle: string;
  submitButtonLabel: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  formTitle,
  postId,
  dialogHeader,
  dialogBody,
  isLoading,
  handleData,
  initialData,
  errorTitle,
  submitButtonLabel,
}) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [content, setCommentContent] = useState('');
  const user = useAppSelector(selectUser);
  const username = user?.username ?? '';

  useEffect(() => {
    if (initialData !== null && initialData !== undefined) {
      setCommentContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (content.replaceAll(/<[^>]*>/g, '').trim() === '') {
      // Description is not filled, or only contains whitespace(s), or only contains line breaks.
      toast({
        title: `${formTitle} Failed!`,
        description: 'Content cannot be empty.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return; // Prevent form submission.
    }

    const commentData: CommentData = {
      content,
      postId,
      username,
    };

    handleData(commentData)
      .then(() => {
        toast({
          title: 'Commented!',
          description: `Your ${formTitle} has been successful!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        navigate(`/forum/${postId}`);
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

  const disableSubmit = initialData !== undefined && initialData !== null ? content === initialData.content : false;

  const handleContentChange = (newContent: React.SetStateAction<string>): void => {
    setCommentContent(newContent);
  };

  return (
    <Card m={12} p={8}>
      <form onSubmit={handleSubmit}>
        {isLoading ? (
          <Spinner size="xl" />
        ) : (
          <Stack spacing={4}>
            <IconWithText text={formTitle} icon={<MdForum size={25} />} fontSize={'2xl'} fontWeight="bold" />
            {/* Insert the post content here */}

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <RichTextEditor value={content} onChange={handleContentChange} useColorModeValue={useColorModeValue} />
            </FormControl>

            <Flex mt={4} justifyContent="space-between">
              <ConfirmationDialog
                dialogHeader={dialogHeader}
                dialogBody={dialogBody}
                mainButtonLabel="Cancel"
                leftButtonLabel="No, stay on this form"
                rightButtonLabel="Yes, bring me back"
                onConfirm={() => {
                  navigate(`/forum/${postId}`);
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

export default CommentForm;
