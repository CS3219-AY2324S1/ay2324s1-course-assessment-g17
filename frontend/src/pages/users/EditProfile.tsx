import React from 'react';
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
  Stack, // Add Stack for spacing between fields
} from '@chakra-ui/react';

interface EditProfileProps {
  isOpen: boolean;
  onCloseModal: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onCloseModal }) => {
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
              <Input type="text" placeholder="Username" />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="text" placeholder="Email" />
            </FormControl>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input type="text" placeholder="Role" />
            </FormControl>
            <FormControl>
              <FormLabel>Languages</FormLabel>
              <Input type="text" placeholder="Languages" />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="solid" colorScheme="teal" mr={4}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfile;
