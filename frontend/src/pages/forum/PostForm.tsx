import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Card,
  useToast,
  useColorModeValue,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import RichTextEditor from '../../components/content/RichTextEditor';
import { FaCheck } from 'react-icons/fa6';
import ConfirmationDialog from '../../components/content/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import IconWithText from '../../components/content/IconWithText';
import { MdForum } from 'react-icons/md';
import type { ForumPostData } from '../../types/forum/forum';
import { type AxiosError } from 'axios';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/authSlice';

interface PostFormProps {
  formTitle: string;
  dialogHeader: string;
  dialogBody: string;
  handleData: (forumData: ForumPostData) => Promise<void>;
  isLoading?: boolean;
  errorTitle: string;
  submitButtonLabel: string;
}

const PostForm: React.FC<PostFormProps> = ({
  formTitle,
  dialogHeader,
  dialogBody,
  handleData,
  isLoading = false,
  errorTitle,
  submitButtonLabel,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [description, setPostDescription] = useState('');

  const user = useAppSelector(selectUser);
  const username = user?.username ?? '';

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    console.log('Title:', title);
    console.log('Post Description:', description);

    const forumData: ForumPostData = {
      title,
      description,
      username,
    };

    handleData(forumData)
      .then(() => {
        toast({
          title: 'Posted!',
          description: 'Your forum post has been created successfully!',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        navigate('/forum');
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

  // Disable submit...

  const handleDescriptionChange = (newContent: React.SetStateAction<string>): void => {
    setPostDescription(newContent);
  };

  return (
    <Card m={12} p={8}>
      <form onSubmit={handleSubmit}>
        {isLoading ? (
          <Spinner size="xl" />
        ) : (
          <Stack spacing={4}>
            <IconWithText text={formTitle} icon={<MdForum size={25} />} fontSize={'2xl'} fontWeight="bold" />
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
              <RichTextEditor
                value={description}
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
                  navigate('/forum');
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

export default PostForm;
