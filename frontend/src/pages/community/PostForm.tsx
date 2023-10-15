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

interface PostFormProps {
  formTitle: string;
  dialogHeader: string;
  dialogBody: string;
  isLoading?: boolean;
  submitButtonLabel: string;
}

const PostForm: React.FC<PostFormProps> = ({
  formTitle,
  dialogHeader,
  dialogBody,
  isLoading = false,
  submitButtonLabel,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    toast({
      title: 'Posted!',
      description: 'Your forum post has been created successfully!',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });

    navigate('/forum');
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
                value={postDescription}
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
