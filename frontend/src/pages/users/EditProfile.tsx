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
  useToast,
} from '@chakra-ui/react';

import type { Language } from '../../types/users/users';
import AuthAPI from '../../api/users/auth';
import type { AxiosError } from 'axios';
import MultiSelect from '../../components/form/MultiSelect';
import UserAPI from '../../api/users/user';

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
  const [allLanguages, setAllLanguages] = useState<Language[]>([]);

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

  useEffect(() => {
    // Fetch language options from backend.
    new UserAPI()
      .getLanguages()
      .then((languages) => {
        setAllLanguages(languages);
      })
      .catch(console.error);
  }, []);

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
              <MultiSelect
                options={allLanguages.map((language) => {
                  return { label: language.language, value: language };
                })}
                // this cursed line is because the user languages and queried languages are not the same object
                initialOptions={allLanguages.filter((languageOption) =>
                  languages.map((language) => language.id).includes(languageOption.id),
                )}
                onChange={(selected) => {
                  setLanguages(selected);
                }}
              />
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
