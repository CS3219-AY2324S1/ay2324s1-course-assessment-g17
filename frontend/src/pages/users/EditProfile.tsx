import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Stack,
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
import { EditorLanguageEnum } from '../../types/code/languages';
import type { Language } from '../../types/users/users';
import AuthAPI from '../../api/users/auth';
import type { AxiosError } from 'axios';

interface EditProfileProps {
  isOpen: boolean;
  onCloseModal: () => void;
  initialUsername: string;
  initialEmail: string;
  initialLanguages: Language[];
  onProfileUpdated: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  isOpen,
  onCloseModal,
  initialUsername,
  initialEmail,
  initialLanguages,
  onProfileUpdated,
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [languages, setLanguages] = useState<Language[]>(initialLanguages);
  const allLanguages = Object.values(EditorLanguageEnum);

  const toast = useToast();

  // Prefill form with initial data whenever form is opened.
  useEffect(() => {
    // Check if data is being fetched correctly.
    console.log('initialUsername:', initialUsername);
    console.log('initialEmail:', initialEmail);
    console.log('initialLanguages:', initialLanguages);

    if (isOpen) {
      setUsername(initialUsername);
      setEmail(initialEmail);
      setLanguages(initialLanguages);
    }
  }, [isOpen, initialUsername, initialEmail, initialLanguages]);

  const handleSave: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const updatedProfile = {
      username,
      email,
      languages,
    };

    console.log('Request Data:', updatedProfile);

    const response = new AuthAPI()
      .updateUserProfile(updatedProfile)
      .then(() => {
        console.log('Response Data:', response);

        // Profile page refreshes automatically when Save button is clicked, so no message is shown to user.

        // Close the modal.
        onCloseModal();

        // Trigger the callback function to refresh the profile page
        onProfileUpdated();
      })
      .catch((err: AxiosError<{ errors: Array<{ msg: string }> }>) => {
        console.error('Error updating profile:', err);
        const errors = err?.response?.data?.errors;
        if (errors !== undefined) {
          errors.map((error) =>
            toast({
              title: 'Profile Update failed.',
              description: error.msg,
              status: 'error',
              duration: 9000,
              isClosable: true,
            }),
          );
        } else {
          toast({
            title: 'Profile Update failed.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Languages</FormLabel>
              <AutoComplete
                openOnFocus
                closeOnSelect
                multiple
                onChange={(selectedLanguages) => {
                  setLanguages(selectedLanguages as Language[]);
                }}
                isLoading={allLanguages.length === 0}
                suggestWhenEmpty
                restoreOnBlurIfEmpty={false}
                value={languages}
              >
                <AutoCompleteInput variant="filled">
                  {({ tags }) =>
                    tags.map((tag, tid) => (
                      <AutoCompleteTag key={tid} label={tag.label as string} onRemove={tag.onRemove} />
                    ))
                  }
                </AutoCompleteInput>
                <AutoCompleteList>
                  {allLanguages.map((language, lid) => (
                    <AutoCompleteItem
                      key={`option-${lid}`}
                      value={language}
                      style={{ marginTop: 4, marginBottom: 4 }}
                      _selected={{ bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.50'), color: 'gray.500' }}
                      _focus={{ bg: useColorModeValue('blackAlpha.100', 'whiteAlpha.100') }}
                    >
                      {language}
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteList>
              </AutoComplete>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={4} onClick={handleSave as () => void}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfile;
