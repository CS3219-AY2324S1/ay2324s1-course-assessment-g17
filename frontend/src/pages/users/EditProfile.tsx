import React, { useState, useEffect, useRef } from 'react';
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
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from '@choc-ui/chakra-autocomplete';
import { EditorLanguageEnum } from '../../types/code/languages';

interface EditProfileProps {
  isOpen: boolean;
  onCloseModal: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onCloseModal }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const allLanguages = Object.values(EditorLanguageEnum);

  // Create a ref for the AutoCompleteInput
  const autoCompleteInputRef = useRef<HTMLInputElement | null>(null);

  const handleAutoCompleteSelect = (selectedLanguages: string[]): void => {
    setLanguages(selectedLanguages);
    // Unfocus the input field after a short delay to prevent cursor flashing
    if (autoCompleteInputRef.current !== null) {
      setTimeout(() => {
        autoCompleteInputRef.current?.blur();
      }, 100);
    }
  };

  // Reset the form fields when the modal is closed.
  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setEmail('');
      setRole('');
      setLanguages([]);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* <form onSubmit={handleSubmit}> */}
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
              <FormLabel>Role</FormLabel>
              <Input
                type="text"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Languages</FormLabel>
              <AutoComplete
                openOnFocus
                closeOnSelect
                multiple
                onChange={handleAutoCompleteSelect}
                isLoading={allLanguages.length === 0}
                suggestWhenEmpty
                restoreOnBlurIfEmpty={false}
                value={languages}
              >
                <AutoCompleteInput variant="filled" isRequired={false} ref={autoCompleteInputRef}>
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
          {/* </form> */}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={4}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfile;
