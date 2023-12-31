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
import { useAppDispatch } from '../../reducers/hooks';
import { setUser } from '../../reducers/authSlice';

interface EditProfileProps {
  isOpen: boolean;
  onCloseModal: () => void;
  initialUsername: string;
  initialEmail: string;
  initialLanguages: Language[];
}

const EditProfile: React.FC<EditProfileProps> = ({
  isOpen,
  onCloseModal,
  initialUsername,
  initialEmail,
  initialLanguages,
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [languages, setLanguages] = useState<Language[]>(initialLanguages);
  const [allLanguages, setAllLanguages] = useState<Language[]>([]);

  const toast = useToast();
  const dispatch = useAppDispatch();

  // Prefill form with initial data whenever form is opened.
  useEffect(() => {
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

    new AuthAPI()
      .updateUserProfile(updatedProfile)
      .then((user) => {
        dispatch(setUser(user));

        // Close the modal.
        onCloseModal();

        toast({
          title: 'Profile Updated!',
          description: 'Your profile has been successfully updated!',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
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
                title="Select Languages..."
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
